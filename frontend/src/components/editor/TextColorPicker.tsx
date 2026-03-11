import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useBuilder } from '@/contexts/BuilderContext';

export function TextColorPicker() {
  const { state } = useBuilder();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState('#000000');

  useEffect(() => {
    if (state.editor.previewMode) {
      setIsVisible(false);
      return;
    }

    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          // Text is selected
          const rect = range.getBoundingClientRect();
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 50
          });
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [state.editor.previewMode]);

  const applyColor = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        try {
          // Try to surround contents
          const span = document.createElement('span');
          span.style.color = selectedColor;
          range.surroundContents(span);
          selection.removeAllRanges();
          setIsVisible(false);
        } catch (e) {
          // If surroundContents fails, use execCommand
          document.execCommand('foreColor', false, selectedColor);
          selection.removeAllRanges();
          setIsVisible(false);
        }
      }
    }
  };

  if (!isVisible || state.editor.previewMode) return null;

  return (
    <div
      className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-2 flex items-center gap-2"
      style={{ left: position.x, top: position.y, transform: 'translateX(-50%)' }}
    >
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="w-8 h-8 rounded border cursor-pointer"
      />
      <Button size="sm" onClick={applyColor} className="text-xs">
        Apply
      </Button>
    </div>
  );
}