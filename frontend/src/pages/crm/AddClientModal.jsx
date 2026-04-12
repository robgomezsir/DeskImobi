import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { CrmModalShell } from './CrmModalShell';

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
    status: 'lead',
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
      const { error } = await supabase.from('clients').insert([payload]).select().single();

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
    <CrmModalShell open={isOpen} onClose={onClose} ariaLabelledBy="add-client-title">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--line-subtle)] bg-bv-surface-muted px-4 py-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-5 sm:pt-5">
        <h3 id="add-client-title" className="text-lg font-display font-bold tracking-tight text-bv-text sm:text-xl">
          Capturar novo lead
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-xl p-2 text-bv-muted transition-colors hover:bg-bv-surface-strong"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-6"
      >
        <div className="space-y-2">
          <label className="ml-1 text-sm font-medium text-bv-muted">Identidade do Lead *</label>
          <input
            required
            className="input-field"
            placeholder="Ex: Maria Oliveira"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-bv-muted">Conexão Digital (Telefone) *</label>
            <input
              required
              className="input-field"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-bv-muted">Correio Eletrônico</label>
            <input
              type="email"
              className="input-field"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-bv-muted">Perfil do Lead</label>
            <select
              className="input-field pr-8"
              value={formData.client_type}
              onChange={(e) => setFormData({ ...formData, client_type: e.target.value })}
            >
              <option value="buyer">Investidor / Comprador</option>
              <option value="tenant">Locatário</option>
              <option value="investor">Estrategista</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-sm font-medium text-bv-muted">Classe de Ativo</label>
            <select
              className="input-field pr-8"
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
            >
              <option value="Apartamento">Apartamento Luxo</option>
              <option value="Casa">Casa de Alto Padrão</option>
              <option value="Terreno">Ativos Terrenos</option>
              <option value="Comercial">Complexo Comercial</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-sm font-medium text-bv-muted">Localização</label>
          <input
            className="input-field"
            placeholder="Bairro, cidade (opcional)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn btn-outline h-12 flex-1 text-bv-muted">
            Recuar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary h-12 flex-[2] font-bold text-black">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Processar Cadastro'}
          </button>
        </div>
      </form>
    </CrmModalShell>
  );
}
