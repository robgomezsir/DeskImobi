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
    location: '',
    status: 'lead'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        user_id: user.id,
        location: formData.location?.trim() || null,
      };
      const { error } = await supabase
        .from('clients')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      toast.success('Cliente cadastrado com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Erro ao cadastrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#141414]/85 p-0 backdrop-blur-none animate-in fade-in duration-300 sm:items-center sm:bg-[#141414]/80 sm:p-4 sm:backdrop-blur-md">
      <div className="glass-blur max-h-[min(90dvh,100%)] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-[var(--line)] shadow-2xl animate-in zoom-in duration-300 sm:rounded-3xl">
        <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--line-subtle)] bg-bv-surface-muted">
          <h3 className="text-xl font-display font-bold tracking-tight text-bv-text">Capturar novo lead</h3>
          <button onClick={onClose} className="p-2 hover:bg-bv-surface-strong rounded-xl transition-colors text-bv-muted">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-bv-muted ml-1">Identidade do Lead *</label>
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
              <label className="text-sm font-medium text-bv-muted ml-1">Conexão Digital (Telefone) *</label>
              <input 
                required
                className="input-field" 
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-bv-muted ml-1">Correio Eletrônico</label>
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
              <label className="text-sm font-medium text-bv-muted ml-1">Perfil do Lead</label>
              <select 
                className="input-field pr-8"
                value={formData.client_type}
                onChange={e => setFormData({...formData, client_type: e.target.value})}
              >
                <option value="buyer">Investidor / Comprador</option>
                <option value="tenant">Locatário</option>
                <option value="investor">Estrategista</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-bv-muted ml-1">Classe de Ativo</label>
              <select 
                className="input-field pr-8"
                value={formData.property_type}
                onChange={e => setFormData({...formData, property_type: e.target.value})}
              >
                <option value="Apartamento">Apartamento Luxo</option>
                <option value="Casa">Casa de Alto Padrão</option>
                <option value="Terreno">Ativos Terrenos</option>
                <option value="Comercial">Complexo Comercial</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-bv-muted ml-1">Localização</label>
            <input
              className="input-field"
              placeholder="Bairro, cidade (opcional)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1 h-12 text-bv-muted"
            >
              Recuar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-[2] h-12 text-black font-bold"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Processar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
