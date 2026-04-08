import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Alternador de tema fixo no canto superior direito da viewport.
 * Visível em todos os módulos (Layout) e nas telas de auth.
 */
export function ThemeToggleFloating() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-[100] rounded-xl p-3 glass text-bv-muted hover:text-bv-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bv-green/50"
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
    >
      {isDark ? <Sun size={22} strokeWidth={2} /> : <Moon size={22} strokeWidth={2} />}
    </button>
  );
}
