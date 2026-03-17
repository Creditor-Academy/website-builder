import React, { useState, useEffect, useRef } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette } from 'lucide-react';

const COMMON_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000', '#FF4500'
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

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

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
        selection.removeAllRanges();
        setIsVisible(false);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={popoverRef}
      className="fixed z-50"
      style={{ top: position.top, left: position.left }}
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Choose Color</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {COMMON_COLORS.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-500 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => applyColor(color)}
                  title={color}
                />
              ))}
            </div>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full h-10 border rounded"
            />
          </div>
          <Button onClick={() => applyColor(selectedColor)} className="w-full">
            Apply Custom Color
          </Button>
        </div>
      </div>
    </div>
  );
}