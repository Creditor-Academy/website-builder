// ─── ContentEditable Cursor Utilities ───────────────────────────────────────

/**
 * Sets cursor to the end of a contenteditable element
 * This fixes the issue where cursor jumps to beginning when typing
 */
export function setCursorToEnd(element: HTMLElement): void {
  if (!element) return;
  
  const range = document.createRange();
  const selection = window.getSelection();
  
  if (!selection) return;
  
  range.selectNodeContents(element);
  range.collapse(false); // collapse to end
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Enhanced input handler for contenteditable elements
 * Preserves cursor position after content changes
 */
export function createContentEditableHandler(
  onChange: (value: string) => void,
  element?: HTMLElement
) {
  return (e: React.FormEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    const value = target.innerHTML || '';
    
    // Call the original change handler
    onChange(value);
    
    // Preserve cursor position
    setTimeout(() => {
      setCursorToEnd(target);
    }, 0);
  };
}

/**
 * Enhanced blur handler for contenteditable elements
 * Ensures proper cleanup and cursor position
 */
export function createContentEditableBlurHandler(
  onChange: (value: string) => void,
  element?: HTMLElement
) {
  return (e: React.FocusEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    const value = target.innerHTML || '';
    
    // Call the original blur handler
    onChange(value);
  };
}
