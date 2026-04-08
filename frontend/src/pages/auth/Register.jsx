import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { UserPlus, Loader2, Mail, Lock, User } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
      <div className="w-full max-w-lg glass p-10 rounded-3xl space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 p-4">
             <img src="/logo-horizontal-branca.png" alt="BrokerVision" className="w-full h-auto object-contain" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-white">
            Ascensão Soberana
          </h1>
          <p className="text-bv-white-ghost">Inicie seu legado no ecossistema BrokerVision.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Nome Completo</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-bv-green">
                <User size={18} />
              </span>
              <input 
                type="text" 
                required
                className="input-field py-3 pl-12 bg-white/5" 
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">E-mail Profissional</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-bv-green">
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                required
                className="input-field py-3 pl-12 bg-white/5" 
                placeholder="seu@trabalho.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Senha</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-bv-green">
                  <Lock size={18} />
                </span>
                <input 
                  type="password" 
                  required
                  className="input-field py-3 pl-12 bg-white/5" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Confirmar Senha</label>
              <div className="relative group">
                <input 
                  type="password" 
                  required
                  className="input-field py-3 bg-white/5" 
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
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              'Solicitar Credenciais'
            )}
          </button>
        </form>

        <div className="text-center text-sm text-bv-white-ghost">
          Já faz parte da elite?{' '}
          <Link to="/login" className="text-bv-green font-bold hover:underline">
            Aceder ao Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}
