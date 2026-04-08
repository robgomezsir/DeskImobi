import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Alternador de tema no fluxo do layout (sem fixed), para alinhar com outros botões da página.
 */
export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex shrink-0 items-center justify-center rounded-xl p-2.5 glass-blur text-bv-muted hover:text-bv-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bv-green/50"
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
    >
      {isDark ? <Sun size={22} strokeWidth={2} /> : <Moon size={22} strokeWidth={2} />}
    </button>
  );
}
