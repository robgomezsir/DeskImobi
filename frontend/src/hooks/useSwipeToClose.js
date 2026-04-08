import { useEffect, useRef } from 'react';

/**
 * Chama onClose ao deslizar para a esquerda (ex.: fechar gaveta).
 * Ignora gestos predominantemente verticais para não competir com o scroll do menu.
 *
 * @param {{ onClose?: () => void; enabled?: boolean; thresholdPx?: number; minHorizontalRatio?: number }} opts
 */
export function useSwipeToClose({
  onClose,
  enabled = false,
  thresholdPx = 56,
  minHorizontalRatio = 1.25,
}) {
  const ref = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!enabled || !onClose) return;
    const el = ref.current;
    if (!el) return;

    const onStart = (e) => {
      const t = e.touches[0];
      startRef.current = { x: t.clientX, y: t.clientY };
    };

    const onEnd = (e) => {
      const start = startRef.current;
      startRef.current = null;
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (dx > -thresholdPx) return;
      if (Math.abs(dx) < Math.abs(dy) * minHorizontalRatio) return;
      onClose();
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    };
  }, [enabled, onClose, thresholdPx, minHorizontalRatio]);

  return ref;
}
