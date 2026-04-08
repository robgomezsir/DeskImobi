import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggleFloating } from '../../components/ThemeToggleFloating';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import logoWhite from '../../assets/logo-white.png';
import logoHorizontalDark from '../../assets/logo-horizontal-dark.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Acesso concedido. Bem-vindo ao BrokerVision.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Ocorreu um erro ao validar suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-bv-page p-4">
      <ThemeToggleFloating />

      <div className="w-full max-w-md glass p-10 rounded-3xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <img
            src={isDark ? logoWhite : logoHorizontalDark}
            alt="BrokerVision"
            className="h-12 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-display font-bold tracking-tight text-bv-text">
            Acesse seu <span className="text-bv-green">Cockpit</span>
          </h1>
          <p className="text-bv-muted">Entre na inteligência soberana do mercado imobiliário.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-bv-text-soft ml-1">E-mail</label>
            <input
              type="email"
              required
              className="input-field py-3 bg-bv-surface-muted"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium text-bv-text-soft">Senha</label>
              <Link
                to="/auth/forgot-password"
                className="text-xs text-bv-green hover:text-bv-green-deep font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <input
              type="password"
              required
              className="input-field py-3 bg-bv-surface-muted"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg font-semibold"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Entrar agora'}
          </button>
        </form>

        <div className="text-center text-sm text-bv-muted">
          Ainda não tem conta?{' '}
          <Link to="/auth/register" className="text-bv-green font-semibold hover:underline">
            Cadastre-se grátis
          </Link>
        </div>
      </div>
    </div>
  );
}
