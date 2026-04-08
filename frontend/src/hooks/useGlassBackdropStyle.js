import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Estilo inline para `backdrop-filter` (Firefox + WebKit), alinhado ao liquid glass do Dashboard.
 * Usar em cartões `glass` / `glass bv-card-hover` dentro de `[data-bv-dashboard-canvas]`.
 */
export function useGlassBackdropStyle() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return useMemo(
    () =>
      isLight
        ? {
            backdropFilter:
              'blur(var(--bv-dashboard-backdrop-blur)) saturate(1.08) brightness(1.02)',
            WebkitBackdropFilter:
              'blur(var(--bv-dashboard-backdrop-blur)) saturate(1.08) brightness(1.02)',
          }
        : {
            backdropFilter:
              'blur(var(--bv-dashboard-backdrop-blur)) saturate(1.14) brightness(1.03)',
            WebkitBackdropFilter:
              'blur(var(--bv-dashboard-backdrop-blur)) saturate(1.14) brightness(1.03)',
          },
    [isLight]
  );
}
