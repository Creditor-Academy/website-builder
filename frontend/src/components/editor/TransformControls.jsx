import React, { useRef, useState, useCallback, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

export function TransformControls({
  children,
  isSelected,
  position,
  size,
  rotation = 0,
  onUpdate,
  onSelect,
  isEditing,
  keepAspectRatio = false,
  minWidth = 20,
  minHeight = 20,
  onDoubleClick
}) {
  const containerRef = useRef(null);
  const [localTransform, setLocalTransform] = useState({
    x: position?.x || 0,
    y: position?.y || 0,
    width: parseInt(size?.width) || 200,
    height: parseInt(size?.height) || 200,
    rotation: rotation || 0,
  });
  const interactionRef = useRef(null);

  useEffect(() => {
    setLocalTransform({
      x: position?.x || 0,
      y: position?.y || 0,
      width: parseInt(size?.width) || 200,
      height: parseInt(size?.height) || 200,
      rotation: rotation || 0,
    });
  }, [position, size, rotation]);
  const x = localTransform.x;
  const y = localTransform.y;
  const w = localTransform.width;
  const h = localTransform.height;
  const r = localTransform.rotation;

  const handlePointerDown = useCallback((e, type, handle = null) => {
    if (!isEditing || e.button !== 0) return;
    e.stopPropagation();



    if (type === 'drag') {
      setTimeout(() => onSelect(e), 0);
    }

    const target = e.target;
    if (target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const initialRect = { x, y, width: w, height: h, rotation: r };

    interactionRef.current = {
      type,
      handle,
      startX,
      startY,
      initialRect,
      frameId: null,
      pointerId: e.pointerId,
      target
    };

    const onPointerMove = (moveEvent) => {
      moveEvent.preventDefault();
      const state = interactionRef.current;
      if (!state) return;

      const dx = moveEvent.clientX - state.startX;
      const dy = moveEvent.clientY - state.startY;

      let newTransform = { ...state.initialRect };

      if (state.type === 'drag') {
        let newX = state.initialRect.x + dx;
        let newY = state.initialRect.y + dy;

        if (containerRef.current?.parentElement) {
          const bounds = containerRef.current.parentElement.getBoundingClientRect();
          if (newX < 0) newX = 0;
          if (newY < 0) newY = 0;
          if (newX + state.initialRect.width > bounds.width) newX = bounds.width - state.initialRect.width;
          if (newY + state.initialRect.height > bounds.height) newY = bounds.height - state.initialRect.height;
        }

        newTransform.x = newX;
        newTransform.y = newY;
        console.log(`Dragging (ID: ${interactionRef.current.target.closest('[data-component-id]')?.dataset.componentId || 'unknown'}): x=${newX}, y=${newY}`);
      }
      else if (state.type === 'rotate') {
        const cxLocal = state.initialRect.width / 2;
        const cyLocal = state.initialRect.height / 2;
        const radInitial = state.initialRect.rotation * Math.PI / 180;

        // Calculate visual center of the unrotated element to act as rotation pivot
        const visualCenterX = state.initialRect.x + cxLocal * Math.cos(radInitial) - cyLocal * Math.sin(radInitial);
        const visualCenterY = state.initialRect.y + cxLocal * Math.sin(radInitial) + cyLocal * Math.cos(radInitial);

        const startAngle = Math.atan2(state.startY - visualCenterY, state.startX - visualCenterX) * (180 / Math.PI);
        const currentAngle = Math.atan2(moveEvent.clientY - visualCenterY, moveEvent.clientX - visualCenterX) * (180 / Math.PI);

        let newRotation = state.initialRect.rotation + (currentAngle - startAngle);
        if (moveEvent.shiftKey) {
          newRotation = Math.round(newRotation / 15) * 15;
        }

        const newRad = newRotation * Math.PI / 180;
        newTransform.rotation = newRotation;

        // Restore x, y so that visual center remains exactly the same while transform-origin is top-left
        newTransform.x = visualCenterX - (cxLocal * Math.cos(newRad) - cyLocal * Math.sin(newRad));
        newTransform.y = visualCenterY - (cxLocal * Math.sin(newRad) + cyLocal * Math.cos(newRad));
      }
      else if (state.type === 'resize') {
        let { x: ix, y: iy, width: iw, height: ih, rotation: ir } = state.initialRect;

        const rad = -ir * Math.PI / 180;
        const localDx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const localDy = dx * Math.sin(rad) + dy * Math.cos(rad);

        let newWidth = iw;
        let newHeight = ih;
        let moveLocalX = 0;
        let moveLocalY = 0;

        const isN = state.handle.includes('n');
        const isS = state.handle.includes('s');
        const isE = state.handle.includes('e');
        const isW = state.handle.includes('w');

        const lockAspect = keepAspectRatio || moveEvent.shiftKey;

        if ((isN || isS) && (isE || isW) && lockAspect) {
          const aspect = iw / ih;
          let signX = isE ? 1 : -1;
          let signY = isS ? 1 : -1;

          let dw = localDx * signX;
          let dh = localDy * signY;

          if (Math.abs(dw) > Math.abs(dh * aspect)) {
            newWidth = iw + dw;
            newHeight = newWidth / aspect;
          } else {
            newHeight = ih + dh;
            newWidth = newHeight * aspect;
          }

          if (newWidth < minWidth) {
            newWidth = minWidth;
            newHeight = minWidth / aspect;
          }
          if (newHeight < minHeight) {
            newHeight = minHeight;
            newWidth = minHeight * aspect;
          }

          const appliedDw = newWidth - iw;
          const appliedDh = newHeight - ih;

          if (isW) moveLocalX = -appliedDw;
          if (isN) moveLocalY = -appliedDh;
        } else {
          if (isE) {
            newWidth = iw + localDx;
            if (newWidth < minWidth) newWidth = minWidth;
          } else if (isW) {
            newWidth = iw - localDx;
            if (newWidth < minWidth) newWidth = minWidth;
            moveLocalX = iw - newWidth;
          }

          if (isS) {
            newHeight = ih + localDy;
            if (newHeight < minHeight) newHeight = minHeight;
          } else if (isN) {
            newHeight = ih - localDy;
            if (newHeight < minHeight) newHeight = minHeight;
            moveLocalY = ih - newHeight;
          }
        }

        const radPos = ir * Math.PI / 180;
        newTransform.width = newWidth;
        newTransform.height = newHeight;
        newTransform.x = ix + (moveLocalX * Math.cos(radPos) - moveLocalY * Math.sin(radPos));
        newTransform.y = iy + (moveLocalX * Math.sin(radPos) + moveLocalY * Math.cos(radPos));
      }

      if (!state.frameId) {
        state.frameId = requestAnimationFrame(() => {
          setLocalTransform(newTransform);
          state.frameId = null;
        });
      }
    };

    const onPointerUp = (upEvent) => {
      const state = interactionRef.current;
      if (!state) return;

      if (state.target && state.target.releasePointerCapture) {
        try {
          state.target.releasePointerCapture(state.pointerId);
        } catch (err) {
          // ignore
        }
      }

      if (state.frameId) {
        cancelAnimationFrame(state.frameId);
      }

      setLocalTransform(prev => {
        if (prev) {
          if (onUpdate) {
            setTimeout(() => onUpdate({
              position: { x: prev.x, y: prev.y },
              style: {
                width: `${prev.width}px`,
                height: `${prev.height}px`,
                rotation: prev.rotation
              }
            }), 0);
          }
        }
        return prev;
      });

      interactionRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
  }, [x, y, w, h, r, isEditing, minWidth, minHeight, onSelect, onUpdate, keepAspectRatio]);

  const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => handlePointerDown(e, 'drag')}
      onDoubleClick={onDoubleClick}
      className={`absolute transition-shadow duration-200 group/comp ${!isEditing ? '' : 'cursor-move'}`}
      style={{
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
        width: `${w}px`,
        height: `${h}px`,
        zIndex: isSelected ? 50 : 10,
        userSelect: 'none',
        touchAction: 'none',
        transformOrigin: 'top left'
      }}
    >
      <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
        {children}
      </div>

      {isSelected && isEditing && (
        <>
          <div className="absolute inset-0 border-2 border-primary pointer-events-none z-10 rounded-sm" />

          <div className="absolute left-1/2 -top-10 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
            <div className="w-px h-6 bg-primary" />
            <div
              onPointerDown={(e) => handlePointerDown(e, 'rotate')}
              className="w-7 h-7 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center cursor-crosshair hover:bg-slate-50 transition-colors z-20"
            >
              <RotateCw className="w-3.5 h-3.5 text-primary" />
            </div>
            {localTransform && interactionRef.current?.type === 'rotate' && (
              <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 font-mono">
                {Math.round(r)}°
              </div>
            )}
          </div>

          {handles.map(handle => {
            const handleStyle = {
              position: 'absolute',
              width: '12px',
              height: '12px',
              backgroundColor: 'white',
              border: '2px solid #3b82f6',
              zIndex: 20,
              pointerEvents: 'auto'
            };

            if (handle.includes('n')) handleStyle.top = '-6px';
            if (handle.includes('s')) handleStyle.bottom = '-6px';
            if (handle.includes('w')) handleStyle.left = '-6px';
            if (handle.includes('e')) handleStyle.right = '-6px';
            if (handle === 'n' || handle === 's') handleStyle.left = 'calc(50% - 6px)';
            if (handle === 'e' || handle === 'w') handleStyle.top = 'calc(50% - 6px)';

            if (handle.length === 2) handleStyle.borderRadius = '50%';

            return (
              <div
                key={handle}
                style={{ ...handleStyle, cursor: `${handle}-resize` }}
                onPointerDown={(e) => handlePointerDown(e, 'resize', handle)}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
