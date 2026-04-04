import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao entrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
      <div className="w-full max-w-md glass p-10 rounded-3xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30 mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight">
            ImobiFlow<span className="text-primary-500">AI</span>
          </h1>
          <p className="text-gray-400">Acesse sua inteligência para vender mais</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">E-mail</label>
            <input 
              type="email" 
              required
              className="input-field py-3 bg-white/5" 
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium text-gray-300">Senha</label>
              <Link to="/auth/forgot-password" size="sm" className="text-xs text-primary-500 hover:text-primary-400">
                Esqueceu a senha?
              </Link>
            </div>
            <input 
              type="password" 
              required
              className="input-field py-3 bg-white/5" 
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
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              'Entrar agora'
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Ainda não tem conta?{' '}
          <Link to="/auth/register" className="text-primary-500 font-semibold hover:underline">
            Cadastre-se grátis
          </Link>
        </div>
      </div>
    </div>
  );
}
