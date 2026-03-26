import React, { useState, useEffect, useRef } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

const COMMON_COLORS = [
  '#000000', '#ffffff', '#94a3b8', '#475569',
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
  '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
];

export function TextColorPicker() {
  const { state, updateComponent } = useBuilder();
  const { editor } = state;
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        if (selectedText.trim()) {
          const rect = range.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const popoverHeight = 200; // approximate height

          let top = rect.bottom + 10;
          if (top + popoverHeight > viewportHeight) {
            top = rect.top - popoverHeight - 10;
          }

          setPosition({
            top: Math.max(10, top),
            left: Math.min(rect.left, window.innerWidth - 300) // 300px width approx
          });
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      setIsVisible(false);
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

  const applyColor = (color: string) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText.trim()) {
        // Wrap selected text in a span with color
        const span = document.createElement('span');
        span.style.color = color;
        range.surroundContents(span);
        
        // Ensure the editor saves the updated HTML to builder context
        const editable = span.closest('[contenteditable="true"], [contenteditable=""], [contenteditable]');
        if (editable) {
          editable.dispatchEvent(new Event('input', { bubbles: true }));
          editable.dispatchEvent(new Event('blur', { bubbles: true }));
        }

        selection.removeAllRanges();
        setIsVisible(false);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 animate-in fade-in zoom-in duration-200"
      style={{ top: position.top, left: position.left }}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-48 ring-1 ring-black/5">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-2">Text Color</label>
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              {COMMON_COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-full aspect-square rounded-md border shadow-sm hover:scale-110 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${selectedColor.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-primary ring-offset-2 scale-110 border-transparent' : 'border-gray-200'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
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
                className="flex-1 shadow-sm h-8 text-xs bg-slate-900 hover:bg-slate-800"
              >
                Apply Color
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}