import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggleButton } from '../../components/ThemeToggleButton';
import logoHorizontalDark from '../../assets/logo-horizontal-dark.png';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) throw error;

      toast.success('Cadastro realizado! Verifique seu e-mail.');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao cadastrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bv-page">
      <header className="flex shrink-0 justify-end px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8">
        <ThemeToggleButton />
      </header>
      <div className="flex flex-1 items-center justify-center p-4 pb-8">
        <div className="w-full max-w-lg space-y-6 rounded-2xl glass-blur p-6 sm:space-y-8 sm:rounded-3xl sm:p-10 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 bg-bv-surface-muted rounded-2xl flex items-center justify-center mb-6 border border-[var(--line)] p-4">
            <img
              src={isDark ? '/logo-horizontal-branca.png' : logoHorizontalDark}
              alt="BrokerVision"
              className="w-full h-auto object-contain"
            />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-bv-text">Ascensão Soberana</h1>
          <p className="text-bv-muted">Inicie seu legado no ecossistema BrokerVision.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-bv-text-soft ml-1">Nome Completo</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bv-muted transition-colors group-focus-within:text-bv-green">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="input-field py-3 pl-12 bg-bv-surface-muted"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-bv-text-soft ml-1">E-mail Profissional</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bv-muted transition-colors group-focus-within:text-bv-green">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                className="input-field py-3 pl-12 bg-bv-surface-muted"
                placeholder="seu@trabalho.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-bv-text-soft ml-1">Senha</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bv-muted transition-colors group-focus-within:text-bv-green">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  className="input-field py-3 pl-12 bg-bv-surface-muted"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-bv-text-soft ml-1">Confirmar Senha</label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  className="input-field py-3 bg-bv-surface-muted"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg font-bold mt-4 text-black"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Solicitar Credenciais'}
          </button>
        </form>

        <div className="text-center text-sm text-bv-muted">
          Já faz parte da elite?{' '}
          <Link to="/login" className="text-bv-green font-bold hover:underline">
            Aceder ao Terminal
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
