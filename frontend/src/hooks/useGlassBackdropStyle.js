import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Estilo inline para `backdrop-filter` (Firefox + WebKit).
 * Com `{ dashboard: true }` — alinhado ao liquid glass do Dashboard (imagem de fundo).
 * Por omissão — molde de módulo: desfoque 10% do liquid glass (`--bv-module-card-blur`).
 */
export function useGlassBackdropStyle(options) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const dashboard =
    options === true || (typeof options === 'object' && options !== null && options.dashboard === true);

  return useMemo(() => {
    if (dashboard) {
      return isLight
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
          };
    }
    return isLight
      ? {
          backdropFilter: 'blur(var(--bv-module-card-blur)) saturate(1.04) brightness(1.01)',
          WebkitBackdropFilter: 'blur(var(--bv-module-card-blur)) saturate(1.04) brightness(1.01)',
        }
      : {
          backdropFilter: 'blur(var(--bv-module-card-blur)) saturate(1.06) brightness(1.01)',
          WebkitBackdropFilter: 'blur(var(--bv-module-card-blur)) saturate(1.06) brightness(1.01)',
        };
  }, [isLight, dashboard]);
}
