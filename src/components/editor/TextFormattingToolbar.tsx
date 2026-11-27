import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { resolveStyles } from '@/builder/styles';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Bold, Italic, Type, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';

const COMMON_COLORS = [
  '#000000', '#ffffff', '#94a3b8', '#475569',
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
  '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
];

const FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Playfair Display',
  'Oswald', 'Lato', 'Poppins', 'Fraunces', 'Outfit', 'Cabinet Grotesk', 'Newsreader', 'Georgia'
];
const SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, 120];

export function TextFormattingToolbar() {
  const selectedNodeId = useBuilderStore((state) => state.editor.selectedNodeId);
  const device = useBuilderStore((state) => state.editor.device);
  const previewMode = useBuilderStore((state) => state.editor.previewMode);
  const page = useBuilderStore((state) => state.getActivePage());
  const updateCanvasStyles = useBuilderStore((state) => state.updateCanvasStyles);
  const updateCanvasNode = useBuilderStore((state) => state.updateCanvasNode);
  const deleteCanvasNode = useBuilderStore((state) => state.deleteCanvasNode);

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState('24');
  const [formats, setFormats] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const isInteractingRef = useRef(false);
  const savedRangeRef = useRef<Range | null>(null);
  const activeEditableRef = useRef<HTMLElement | null>(null);
  const dismissedRef = useRef(false);

  const sections = useMemo(() => (page ? normalizePageSections(page.sections, page.id) : []), [page]);
  const found = useMemo(() => (selectedNodeId ? findNode(sections, selectedNodeId) : null), [sections, selectedNodeId]);
  const selectedNode = found?.node;
  const isTextNode = Boolean(
    selectedNode &&
      (selectedNode.type === 'text' ||
        selectedNode.type === 'button' ||
        (selectedNode.content && typeof (selectedNode.content as Record<string, unknown>).text === 'string'))
  );

  const nodeStylesKey = selectedNode
    ? `${selectedNode.id}-${device}-${selectedNode.styles?.fontFamily}-${selectedNode.styles?.fontSize}-${selectedNode.styles?.color}-${selectedNode.styles?.fontWeight}-${selectedNode.styles?.fontStyle}`
    : '';

  const targetNodeId =
    activeEditableRef.current?.closest('[data-canvas-node]')?.getAttribute('data-canvas-node') ||
    (isTextNode ? selectedNodeId : null);

  const updatePosition = useCallback(() => {
    if (dismissedRef.current || previewMode) {
      setIsVisible(false);
      return;
    }

    let targetRect: DOMRect | null = null;
    const selection = typeof window !== 'undefined' ? window.getSelection() : null;

    // 1. Text range inside editable
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const clientRects = range.getClientRects();
      if (clientRects.length > 0 && (clientRects[0].width > 0 || clientRects[0].height > 0)) {
        targetRect = clientRects[0];
      }
    }

    // 2. Active editable element
    if (!targetRect && activeEditableRef.current && activeEditableRef.current.isConnected) {
      targetRect = activeEditableRef.current.getBoundingClientRect();
    }

    // 3. Fallback to DOM element for selected node
    if (!targetRect && selectedNodeId && isTextNode) {
      const nodeEl = document.querySelector(`[data-canvas-node="${selectedNodeId}"]`) as HTMLElement | null;
      if (nodeEl) {
        targetRect = nodeEl.getBoundingClientRect();
      }
    }

    if (!targetRect || (targetRect.width === 0 && targetRect.height === 0)) {
      if (!isInteractingRef.current) {
        setIsVisible(false);
      }
      return;
    }

    const toolbarWidth = toolbarRef.current?.offsetWidth || 480;
    const toolbarHeight = toolbarRef.current?.offsetHeight || 52;

    // Left boundary: account for left sidebar panel or nav
    const leftPanel = document.querySelector('[data-panel-group] > [data-panel]:first-child') as HTMLElement | null;
    const leftNav = document.querySelector('aside') as HTMLElement | null;
    let minLeft = 16;
    if (leftPanel) {
      const r = leftPanel.getBoundingClientRect();
      if (r.right > 0 && r.width > 0) minLeft = Math.max(minLeft, r.right + 12);
    } else if (leftNav) {
      const r = leftNav.getBoundingClientRect();
      if (r.right > 0 && r.width > 0) minLeft = Math.max(minLeft, r.right + 12);
    }

    // Right boundary: account for right properties panel
    const rightPanel = document.querySelector('[data-panel-group] > [data-panel]:last-child') as HTMLElement | null;
    let maxRight = window.innerWidth - 16;
    if (rightPanel) {
      const r = rightPanel.getBoundingClientRect();
      if (r.left > 0 && r.left < window.innerWidth) {
        maxRight = Math.min(maxRight, r.left - 12);
      }
    }

    // Top boundary: account for top header
    const topHeader = document.querySelector('header') as HTMLElement | null;
    const minTop = topHeader ? topHeader.getBoundingClientRect().bottom + 10 : 64;

    const targetCenterX = targetRect.left + targetRect.width / 2;
    let left = targetCenterX - toolbarWidth / 2;
    left = Math.max(minLeft, Math.min(left, Math.max(minLeft, maxRight - toolbarWidth)));

    let top = targetRect.top - toolbarHeight - 10;
    if (top < minTop) {
      top = targetRect.bottom + 10;
    }
    if (top + toolbarHeight > window.innerHeight - 16) {
      top = window.innerHeight - toolbarHeight - 16;
    }

    setPosition({ top: Math.round(top), left: Math.round(left) });
    setIsVisible(true);
  }, [previewMode, selectedNodeId, isTextNode]);

  // Synchronize styles when selected node changes
  useEffect(() => {
    if (!selectedNode || !isTextNode) {
      if (!activeEditableRef.current) {
        setIsVisible(false);
      }
      return;
    }
    dismissedRef.current = false;
    const resolved = resolveStyles(selectedNode.styles || {}, selectedNode.responsiveStyles || {}, device);
    if (resolved.fontFamily) {
      const matched = FONTS.find((f) => f.toLowerCase() === String(resolved.fontFamily).toLowerCase());
      setFontFamily(matched || String(resolved.fontFamily));
    }
    if (resolved.fontSize) {
      setFontSize(String(resolved.fontSize).replace('px', ''));
    }
    if (resolved.color) {
      setSelectedColor(String(resolved.color));
    }
    const currentFormats: string[] = [];
    if (resolved.fontWeight === 'bold' || Number(resolved.fontWeight) >= 600) {
      currentFormats.push('bold');
    }
    if (resolved.fontStyle === 'italic') {
      currentFormats.push('italic');
    }
    setFormats(currentFormats);
    updatePosition();
  }, [selectedNodeId, device, nodeStylesKey, isTextNode, updatePosition]);

  useEffect(() => {
    const editableFromNode = (start: Node | null) => {
      let node = start;
      while (node && node !== document.body) {
        if (node instanceof HTMLElement && node.getAttribute('contenteditable') === 'true') return node;
        node = node.parentNode;
      }
      return null;
    };

    const handleSelectionChange = () => {
      if (dismissedRef.current) return;
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const editable = editableFromNode(selection.anchorNode);
        if (editable) {
          activeEditableRef.current = editable;
          savedRangeRef.current = range.cloneRange();
          dismissedRef.current = false;

          const currentFormats: string[] = [];
          if (document.queryCommandState('bold')) currentFormats.push('bold');
          if (document.queryCommandState('italic')) currentFormats.push('italic');
          if (currentFormats.length > 0) setFormats(currentFormats);

          const font = document.queryCommandValue('fontName');
          if (font) {
            const normalized = font.replace(/['"]/g, '').split(',')[0].trim();
            const matched = FONTS.find((f) => f.toLowerCase() === normalized.toLowerCase());
            if (matched) setFontFamily(matched);
          }

          const size = document.queryCommandValue('fontSize');
          if (size && !isNaN(Number(size))) {
            const logicalMap: Record<string, string> = {
              '1': '10', '2': '13', '3': '16', '4': '18', '5': '24', '6': '32', '7': '48'
            };
            setFontSize(logicalMap[size] || size.replace('px', ''));
          }
        }
      }
      updatePosition();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (isInteractingRef.current) return;
      const target = event.target;
      const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      if (!element) return;
      if (toolbarRef.current?.contains(element)) return;
      if (
        element.closest(
          '[data-text-toolbar], [data-radix-popper-content-wrapper], [data-radix-select-content], [role="listbox"], [role="dialog"], [data-radix-portal]'
        )
      ) {
        return;
      }
      if (element.closest('[contenteditable="true"]') || element.closest('[data-canvas-node]')) {
        dismissedRef.current = false;
        return;
      }
      dismissedRef.current = true;
      activeEditableRef.current = null;
      savedRangeRef.current = null;
      setIsVisible(false);
    };

    const handleReposition = () => {
      if (!isInteractingRef.current) {
        updatePosition();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [updatePosition]);

  const syncNodeContent = (html: string) => {
    if (!targetNodeId) return;
    const curPage = useBuilderStore.getState().getActivePage();
    const curSections = curPage ? normalizePageSections(curPage.sections, curPage.id) : [];
    const target = findNode(curSections, targetNodeId);
    if (target) {
      updateCanvasNode(targetNodeId, {
        content: { ...(target.node.content as Record<string, unknown>), text: html },
      });
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && savedRangeRef.current) {
      try {
        selection.removeAllRanges();
        selection.addRange(savedRangeRef.current);
      } catch {
        // Range invalidated if DOM was modified
      }
    }
  };

  const applyCustomStyle = (styleProp: string, value: string) => {
    restoreSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
      const span = document.createElement('span');
      (span.style as unknown as Record<string, string>)[styleProp] = value;
      try {
        range.surroundContents(span);
        savedRangeRef.current = range.cloneRange();
        return;
      } catch {
        // Fallback
      }
    }

    try {
      document.execCommand('styleWithCSS', false, 'true');
      const fragment = range.extractContents();

      const applyToNodes = (nodes: NodeList | Node[]) => {
        nodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            (el.style as unknown as Record<string, string>)[styleProp] = value;
            applyToNodes(Array.from(el.childNodes));
          } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            const span = document.createElement('span');
            (span.style as unknown as Record<string, string>)[styleProp] = value;
            const parent = node.parentNode;
            if (parent) {
              parent.replaceChild(span, node);
              span.appendChild(node);
            }
          }
        });
      };

      const nodesToInsert = Array.from(fragment.childNodes);
      applyToNodes(nodesToInsert);
      const firstNode = nodesToInsert[0];
      const lastNode = nodesToInsert[nodesToInsert.length - 1];

      range.insertNode(fragment);

      if (firstNode && lastNode) {
        const newRange = document.createRange();
        newRange.setStartBefore(firstNode);
        newRange.setEndAfter(lastNode);
        selection.removeAllRanges();
        selection.addRange(newRange);
        savedRangeRef.current = newRange.cloneRange();
      }
    } catch {
      // ExecCommand fallback
    }
  };

  const applyCommand = (command: string, value: string | undefined = undefined) => {
    restoreSelection();
    try {
      document.execCommand(command, false, value);
    } catch {
      // ExecCommand fallback
    }
  };

  const handleFontFamilyChange = (val: string) => {
    setFontFamily(val);
    if (targetNodeId) {
      updateCanvasStyles(targetNodeId, { fontFamily: val });
    }
    const selection = window.getSelection();
    const hasSelection = Boolean(selection && selection.rangeCount > 0 && !selection.isCollapsed);
    if (hasSelection && activeEditableRef.current) {
      applyCustomStyle('fontFamily', val);
      syncNodeContent(activeEditableRef.current.innerHTML);
    } else if (activeEditableRef.current) {
      activeEditableRef.current.style.fontFamily = val;
      syncNodeContent(activeEditableRef.current.innerHTML);
    }
  };

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
    const sizeWithPx = `${val}px`;
    if (targetNodeId) {
      updateCanvasStyles(targetNodeId, { fontSize: sizeWithPx });
    }
    const selection = window.getSelection();
    const hasSelection = Boolean(selection && selection.rangeCount > 0 && !selection.isCollapsed);
    if (hasSelection && activeEditableRef.current) {
      applyCustomStyle('fontSize', sizeWithPx);
      syncNodeContent(activeEditableRef.current.innerHTML);
    } else if (activeEditableRef.current) {
      activeEditableRef.current.style.fontSize = sizeWithPx;
      syncNodeContent(activeEditableRef.current.innerHTML);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (targetNodeId) {
      updateCanvasStyles(targetNodeId, { color });
    }
    const selection = window.getSelection();
    const hasSelection = Boolean(selection && selection.rangeCount > 0 && !selection.isCollapsed);
    if (hasSelection && activeEditableRef.current) {
      applyCommand('foreColor', color);
      syncNodeContent(activeEditableRef.current.innerHTML);
    } else if (activeEditableRef.current) {
      activeEditableRef.current.style.color = color;
      syncNodeContent(activeEditableRef.current.innerHTML);
    }
  };

  const handleFormatsChange = (v: string[]) => {
    const nextBold = v.includes('bold');
    const nextItalic = v.includes('italic');
    setFormats(v);

    if (targetNodeId) {
      updateCanvasStyles(targetNodeId, {
        fontWeight: nextBold ? '700' : '400',
        fontStyle: nextItalic ? 'italic' : 'normal',
      });
    }

    const selection = window.getSelection();
    const hasSelection = Boolean(selection && selection.rangeCount > 0 && !selection.isCollapsed);
    if (hasSelection && activeEditableRef.current) {
      if (nextBold !== formats.includes('bold')) applyCommand('bold');
      if (nextItalic !== formats.includes('italic')) applyCommand('italic');
      syncNodeContent(activeEditableRef.current.innerHTML);
    }
  };

  const handleClearFormatting = () => {
    setFormats([]);
    if (targetNodeId) {
      updateCanvasStyles(targetNodeId, {
        fontFamily: 'Inter',
        fontWeight: '400',
        fontStyle: 'normal',
        textDecoration: 'none',
      });
    }
    const selection = window.getSelection();
    const hasSelection = Boolean(selection && selection.rangeCount > 0 && !selection.isCollapsed);
    if (hasSelection && activeEditableRef.current) {
      applyCommand('removeFormat');
      syncNodeContent(activeEditableRef.current.innerHTML);
    }
  };

  const handleDelete = () => {
    const selection = window.getSelection();
    const hasSelection = Boolean(selection && selection.rangeCount > 0 && !selection.isCollapsed);
    if (hasSelection && activeEditableRef.current) {
      restoreSelection();
      const range = selection?.getRangeAt(0);
      if (range) {
        range.deleteContents();
        syncNodeContent(activeEditableRef.current.innerHTML);
      }
    } else if (targetNodeId) {
      deleteCanvasNode(targetNodeId);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      data-text-toolbar=""
      className="fixed z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement | null;
        if (
          target?.closest(
            'input, textarea, select, [role="combobox"], [role="option"], [data-radix-collection-item], button'
          )
        ) {
          return;
        }
        e.preventDefault();
      }}
    >
      <div className="bg-white border text-sm font-medium border-gray-200 rounded-xl shadow-xl flex items-center p-1.5 ring-1 ring-black/5 h-12">
        {/* Typography */}
        <div className="px-2 flex flex-col justify-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 px-2">Typography</span>
          <Select
            value={fontFamily}
            onValueChange={handleFontFamilyChange}
            onOpenChange={(open) => {
              isInteractingRef.current = open;
            }}
          >
            <SelectTrigger
              data-testid="text-toolbar-font"
              className="h-6 text-xs border-none shadow-none bg-slate-50 hover:bg-slate-100 rounded-md px-2 focus:ring-0 w-[120px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((font) => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-8 mx-1 opacity-50 bg-slate-200" />

        {/* Size */}
        <div className="px-2 flex flex-col justify-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 px-2">Size</span>
          <Select
            value={fontSize}
            onValueChange={handleFontSizeChange}
            onOpenChange={(open) => {
              isInteractingRef.current = open;
            }}
          >
            <SelectTrigger
              data-testid="text-toolbar-size"
              className="h-6 text-xs border-none shadow-none bg-slate-50 hover:bg-slate-100 rounded-md px-2 focus:ring-0 min-w-[50px] w-auto gap-1"
            >
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {SIZES.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-8 mx-2 opacity-50 bg-slate-200" />

        {/* Styles Toggle */}
        <ToggleGroup
          type="multiple"
          value={formats}
          onValueChange={handleFormatsChange}
          className="bg-slate-50 p-0.5 rounded-lg"
        >
          <ToggleGroupItem
            value="bold"
            aria-label="Toggle bold"
            className="h-9 w-9 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm"
          >
            <Bold className="h-4 w-4 text-slate-700 font-bold" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            aria-label="Toggle italic"
            className="h-9 w-9 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm"
          >
            <Italic className="h-4 w-4 text-slate-700 italic" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg ml-1"
          title="Clear Formatting"
          aria-label="Clear Formatting"
          onClick={handleClearFormatting}
        >
          <Type className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="h-8 mx-2 opacity-50 bg-slate-200" />

        {/* Color Picker Popover */}
        <Popover
          onOpenChange={(open) => {
            isInteractingRef.current = open;
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              data-testid="text-toolbar-color-trigger"
              className="h-8 px-2 bg-slate-50 hover:bg-slate-100 rounded-lg gap-2 cursor-pointer border border-transparent hover:border-slate-200 group"
              title="Text Color"
              aria-label="Text Color"
            >
              <div
                className="w-4 h-4 rounded-full border border-slate-200 shadow-sm transition-transform group-hover:scale-110"
                style={{ backgroundColor: selectedColor }}
              />
              <Palette className="w-3.5 h-3.5 text-slate-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-48 p-3 rounded-xl shadow-xl border-slate-200 animate-in fade-in slide-in-from-top-2"
            sideOffset={12}
          >
            <label className="text-xs font-bold text-slate-700 block mb-2">Text Color</label>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {COMMON_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-full aspect-square rounded-md border shadow-sm hover:scale-110 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    selectedColor.toLowerCase() === color.toLowerCase()
                      ? 'ring-2 ring-primary ring-offset-2 scale-110 border-transparent'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  title={color}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 pt-2.5 mt-1">
              <div
                className="w-8 h-8 rounded-md border border-gray-200 shadow-sm overflow-hidden relative cursor-pointer group shrink-0"
                title="Tweak Shade"
              >
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                  <Palette className="w-3.5 h-3.5 text-white filter drop-shadow" />
                </div>
              </div>
              <Button
                size="sm"
                type="button"
                onClick={() => handleColorChange(selectedColor)}
                className="flex-1 shadow-sm h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white"
              >
                Apply Color
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8 mx-3 opacity-50 bg-slate-200" />

        {/* Delete */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg ml-1"
            title="Delete Selected Text/Node"
            aria-label="Delete Selected Text/Node"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
