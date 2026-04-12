import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { formatClientStatus } from './clientStatusLabel';
import { CrmModalShell } from './CrmModalShell';

const STATUS_OPTIONS = ['lead', 'contact', 'negotiation', 'closed', 'lost'];

export default function EditClientModal({ client, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property_type: '',
    location: '',
    status: 'lead',
    notes: '',
  });

  useEffect(() => {
    if (!client || !isOpen) return;
    setFormData({
      name: client.name ?? '',
      phone: client.phone ?? '',
      email: client.email ?? '',
      property_type: client.property_type ?? '',
      location: client.location ?? '',
      status: client.status ?? 'lead',
      notes: client.notes ?? '',
    });
  }, [client, isOpen]);

  if (!isOpen || !client) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          property_type: formData.property_type || null,
          location: formData.location || null,
          status: formData.status,
          notes: formData.notes || null,
        })
        .eq('id', client.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Cliente atualizado.');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CrmModalShell open={isOpen} onClose={onClose} ariaLabelledBy="edit-client-title">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--line-subtle)] bg-bv-surface-muted px-4 py-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-5 sm:pt-5">
        <h3 id="edit-client-title" className="text-lg font-display font-bold tracking-tight text-bv-text sm:text-xl">
          Editar cliente
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
            <label className="text-sm font-medium text-bv-muted ml-1">Nome *</label>
            <input
              required
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-bv-muted ml-1">Telefone *</label>
              <input
                required
                className="input-field"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-bv-muted ml-1">E-mail</label>
              <input
                type="email"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-bv-muted ml-1">Tipo de imóvel</label>
              <select
                className="input-field pr-8"
                value={formData.property_type || 'Apartamento'}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
              >
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Terreno">Terreno</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-bv-muted ml-1">Status</label>
              <select
                className="input-field pr-8"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {formatClientStatus(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-bv-muted ml-1">Localização</label>
            <input
              className="input-field"
              placeholder="Bairro, cidade..."
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-bv-muted ml-1">Notas</label>
            <textarea
              className="input-field min-h-[100px] resize-y"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="btn btn-outline h-12 flex-1 text-bv-muted">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary h-12 flex-[2] font-bold text-black">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Salvar'}
          </button>
        </div>
      </form>
    </CrmModalShell>
  );
}
