import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface EditableProps extends React.HTMLAttributes<HTMLElement> {
  value: string;
  onSave: (val: string) => void;
  isEditing: boolean;
  as?: any;
  tagName?: string;
  className?: string;
  suppressContentEditableWarning?: boolean;
}

/**
 * A robust ContentEditable component that prevents cursor jumping by 
 * only updating the DOM when the incoming value truly differs from the current innerHTML.
 * This also ensures spellchecker modifications are captured correctly.
 */
export const Editable = forwardRef<HTMLElement, EditableProps>(({ 
  value, 
  onSave, 
  isEditing, 
  as: Tag = 'span', 
  className = '',
  suppressContentEditableWarning = true,
  ...props 
}, forwardedRef) => {
  const innerRef = useRef<HTMLElement>(null);
  
  // Expose the internal ref
  useImperativeHandle(forwardedRef, () => innerRef.current!);

  // Sync state -> DOM without resetting cursor if content matches
  useEffect(() => {
    if (innerRef.current && innerRef.current.innerHTML !== value) {
      innerRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    // Intentionally empty. We only save on blur to prevent React re-renders 
    // from interrupting native browser features like spellcheckers.
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newContent = e.currentTarget.innerHTML;
    if (newContent !== value) {
      onSave(newContent);
    }
  };

  // Prevent parent events but allow typing
  const handleClick = (e: React.MouseEvent<any>) => {
    if (isEditing) {
      e.stopPropagation();
    }
    props.onClick?.(e);
  };

  return (
    <Tag
      {...props}
      ref={innerRef}
      className={`${className} ${isEditing ? 'cursor-text outline-none focus:ring-1 focus:ring-primary/20 rounded-sm' : ''}`}
      contentEditable={isEditing}
      suppressContentEditableWarning={suppressContentEditableWarning}
      onInput={isEditing ? handleInput : undefined}
      onBlur={isEditing ? handleBlur : undefined}
      onClick={handleClick}
      // Note: we DON'T use dangerouslySetInnerHTML here. 
      // We manage it manually in useEffect for robustness.
    />
  );
});

Editable.displayName = 'Editable';
