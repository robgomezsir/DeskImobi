import { Toaster } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-right"
      richColors
      theme={theme === 'dark' ? 'dark' : 'light'}
    />
  );
}
