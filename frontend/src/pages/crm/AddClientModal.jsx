import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function AddClientModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    client_type: 'buyer',
    property_type: 'Apartamento',
    status: 'lead'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...formData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Cliente cadastrado com sucesso!');
      onSuccess(data);
      onClose();
    } catch (error) {
      toast.error('Erro ao cadastrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-white/5">
          <h3 className="text-xl font-display font-bold">Novo Cliente</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Nome Completo *</label>
            <input 
              required
              className="input-field" 
              placeholder="Ex: Maria Oliveira"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Telefone *</label>
              <input 
                required
                className="input-field" 
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">E-mail</label>
              <input 
                type="email"
                className="input-field" 
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Tipo de Cliente</label>
              <select 
                className="input-field pr-8"
                value={formData.client_type}
                onChange={e => setFormData({...formData, client_type: e.target.value})}
              >
                <option value="buyer">Comprador</option>
                <option value="tenant">Locatário</option>
                <option value="investor">Investidor</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Interesse</label>
              <select 
                className="input-field pr-8"
                value={formData.property_type}
                onChange={e => setFormData({...formData, property_type: e.target.value})}
              >
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Terreno">Terreno</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1 h-12"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-[2] h-12"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
