import React, { useState, useEffect, useRef } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Bold, Italic, Type, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';

const COMMON_COLORS = [
  '#000000', '#ffffff', '#94a3b8', '#475569',
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
  '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
];

const FONTS = ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Playfair Display', 'Oswald', 'Lato', 'Poppins', 'Fraunces', 'Outfit', 'Cabinet Grotesk', 'Newsreader'];
const SIZES = [16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, 120];

export function TextFormattingToolbar() {
  const { state, updateComponent, deleteComponent } = useBuilder();
  const { editor, page } = state;
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState('24');
  const [formats, setFormats] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('#000000');
  
  // Track if user is interacting with toolbar controls (popovers, selects)
  const isInteractingRef = useRef(false);
  // Store the active selection range to restore it when color picker steals focus
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        // Ensure the selection is within our editable content area
        let node = selection.anchorNode;
        let isEditable = false;
        while (node && node !== document.body) {
          if (node instanceof HTMLElement && node.getAttribute('contenteditable') === 'true') {
            isEditable = true;
            break;
          }
          node = node.parentNode;
        }

        if (selectedText.trim() && isEditable) {
          savedRangeRef.current = range.cloneRange();
          const rect = range.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const toolbarHeight = 60; // approximate height

          let top = rect.top - toolbarHeight - 10;
          if (top < 10) {
            top = rect.bottom + 10;
          }

          setPosition({
            top: Math.max(10, top),
            // Center the toolbar above the selection
            left: Math.max(10, Math.min(rect.left + (rect.width / 2) - 300, window.innerWidth - 650))
          });
          
          // Update format states
          const currentFormats: string[] = [];
          if (document.queryCommandState('bold')) currentFormats.push('bold');
          if (document.queryCommandState('italic')) currentFormats.push('italic');
          setFormats(currentFormats);

          // Get font name and normalize it
          const font = document.queryCommandValue('fontName');
          if (font) {
            const normalizedFont = font.replace(/['"]/g, '').split(',')[0].trim();
            const matchedFont = FONTS.find(f => f.toLowerCase() === normalizedFont.toLowerCase());
            if (matchedFont) setFontFamily(matchedFont);
          }

          // Get font size and normalize it
          let size = document.queryCommandValue('fontSize');
          if (size) {
            // Map logical sizes (1-7) to pixels if needed
            const logicalMap: Record<string, string> = {
              '1': '10', '2': '13', '3': '16', '4': '18', '5': '24', '6': '32', '7': '48'
            };
            
            if (logicalMap[size]) {
              size = logicalMap[size];
            } else {
              size = size.replace('px', '');
            }
            
            // Only set if it's a number and we have a match in SIZES
            if (size && !isNaN(Number(size))) {
              setFontSize(size);
            }
          } else {
            // Fallback: try to get computed style if command returns nothing (common for multi-node)
            const parent = range.commonAncestorContainer;
            const element = parent.nodeType === Node.ELEMENT_NODE ? parent as HTMLElement : parent.parentElement;
            if (element) {
              const computedSize = window.getComputedStyle(element).fontSize;
              if (computedSize) {
                setFontSize(computedSize.replace('px', ''));
              }
            }
          }

          setIsVisible(true);
        } else if (!isInteractingRef.current) {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      if (!isInteractingRef.current) {
        setIsVisible(false);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleSelectionChange);
    };
  }, []);

  useEffect(() => {
    setIsVisible(false);
  }, [editor.selectedSectionId, editor.selectedComponentId]);

  const fireInputEvent = () => {
    const selection = window.getSelection();
    let node = selection?.anchorNode;
    if (!node && savedRangeRef.current) {
      node = savedRangeRef.current.startContainer;
    }
    
    if (node) {
       const editable = node instanceof HTMLElement ? node.closest('[contenteditable="true"]') : node?.parentElement?.closest('[contenteditable="true"]');
       if (editable) {
          // Trigger both input and blur events to ensure state persistence
          editable.dispatchEvent(new Event('input', { bubbles: true }));
          // We wait a tiny bit before blur to ensure execCommand finished
          setTimeout(() => {
            editable.dispatchEvent(new Event('focusout', { bubbles: true }));
          }, 50);
       }
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && savedRangeRef.current) {
        selection.removeAllRanges();
        selection.addRange(savedRangeRef.current);
    }
  };

  const applyCommand = (command: string, value: string | undefined = undefined) => {
    restoreSelection();
    document.execCommand(command, false, value);
    fireInputEvent();
  };

  const applyColor = (color: string) => {
    applyCommand('foreColor', color);
  };

  const applyCustomStyle = (styleProp: string, value: string) => {
    restoreSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Check if we can use simple surroundContents (single text node)
    if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
      const span = document.createElement('span');
      (span.style as any)[styleProp] = value;
      try {
        range.surroundContents(span);
        fireInputEvent();
        return;
      } catch (e) {
        // Fall through to complex handler if surroundContents fails
      }
    }

    // Complex handler for multiple nodes
    document.execCommand('styleWithCSS', false, 'true');
    
    const fragment = range.extractContents();
    
    const applyToNodes = (nodes: NodeList | Node[]) => {
      nodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          el.style[styleProp as any] = value;
          // Also apply to children to override more specific styles
          applyToNodes(Array.from(el.childNodes));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          const span = document.createElement('span');
          span.style[styleProp as any] = value;
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
    
    // Re-select the inserted content
    if (firstNode && lastNode) {
      const newRange = document.createRange();
      newRange.setStartBefore(firstNode);
      newRange.setEndAfter(lastNode);
      selection.removeAllRanges();
      selection.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
    }
    
    fireInputEvent();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => {
        // Prevent clicking the toolbar from clearing text selection
        e.preventDefault();
      }}
    >
      <div className="bg-white border text-sm font-medium border-gray-200 rounded-xl shadow-xl flex items-center p-1.5 ring-1 ring-black/5 h-12">
        
        {/* Typography */}
        <div className="px-2 flex flex-col justify-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 px-2">Typography</span>
          <Select 
            value={fontFamily} 
            onValueChange={(val) => {
              setFontFamily(val);
              applyCustomStyle('fontFamily', val);
            }}
            onOpenChange={(open) => {
              isInteractingRef.current = open;
            }}
          >
            <SelectTrigger className="h-6 text-xs border-none shadow-none bg-slate-50 hover:bg-slate-100 rounded-md px-2 focus:ring-0 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map(font => (
                <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font}</SelectItem>
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
            onValueChange={(val) => {
              setFontSize(val);
              applyCustomStyle('fontSize', `${val}px`);
            }}
            onOpenChange={(open) => {
              isInteractingRef.current = open;
            }}
          >
            <SelectTrigger className="h-6 text-xs border-none shadow-none bg-slate-50 hover:bg-slate-100 rounded-md px-2 focus:ring-0 min-w-[50px] w-auto gap-1">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {SIZES.map(size => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-8 mx-2 opacity-50 bg-slate-200" />

        {/* Styles Toggle */}
        <ToggleGroup 
          type="multiple" 
          value={formats} 
          onValueChange={(v) => {
            if (v.includes('bold') !== formats.includes('bold')) applyCommand('bold');
            if (v.includes('italic') !== formats.includes('italic')) applyCommand('italic');
            setFormats(v);
          }}
          className="bg-slate-50 p-0.5 rounded-lg"
        >
          <ToggleGroupItem value="bold" aria-label="Toggle bold" className="h-9 w-9 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm">
            <Bold className="h-4 w-4 text-slate-700 font-bold" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic" className="h-9 w-9 rounded-md data-[state=on]:bg-white data-[state=on]:shadow-sm">
            <Italic className="h-4 w-4 text-slate-700 italic" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg ml-1"
          title="Clear Formatting"
          onClick={() => {
            applyCommand('removeFormat');
            setFormats([]);
          }}
        >
          <Type className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="h-8 mx-2 opacity-50 bg-slate-200" />

        {/* Color Picker Popover embedded inside toolbar */}
        <Popover onOpenChange={(open) => { isInteractingRef.current = open; }}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 px-2 bg-slate-50 hover:bg-slate-100 rounded-lg gap-2 cursor-pointer border border-transparent hover:border-slate-200 group">
              <div className="w-4 h-4 rounded-full border border-slate-200 shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: selectedColor }} />
              <Palette className="w-3.5 h-3.5 text-slate-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3 rounded-xl shadow-xl border-slate-200 animate-in fade-in slide-in-from-top-2" sideOffset={12}>
            <label className="text-xs font-bold text-slate-700 block mb-2">Text Color</label>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {COMMON_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-full aspect-square rounded-md border shadow-sm hover:scale-110 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${selectedColor.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-primary ring-offset-2 scale-110 border-transparent' : 'border-gray-200'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSelectedColor(color);
                    applyColor(color);
                  }}
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
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                  <Palette className="w-3.5 h-3.5 text-white filter drop-shadow" />
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => applyColor(selectedColor)} 
                className="flex-1 shadow-sm h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white"
              >
                Apply Color
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8 mx-3 opacity-50 bg-slate-200" />

        {/* Component / Section Actions */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg ml-1"
            title="Delete Selected Text/Node"
            onClick={() => {
              restoreSelection();
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                fireInputEvent();
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </div>
  );
}
