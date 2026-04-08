import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  Sparkles,
} from 'lucide-react';
import AddClientModal from './AddClientModal';
import { CRMClientMobileCard } from './CRMClientMobileCard';
import axios from 'axios';
import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { useRegisterAppFab } from '../../contexts/AppFabContext';
import { PageToolbar } from '../../components/layout/PageToolbar';
import { ModuleFabButton } from '../../components/layout/ModuleFabButton';

const crm = BV_MODULES.crm;

export default function CRM() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classifyingId, setClassifyingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, session } = useAuth();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data);
    } catch (error) {
      toast.error('Erro ao carregar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const hay = [c.name, c.email, c.phone, c.property_type, c.location]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [clients, searchTerm]);

  const handleClassify = async (id) => {
    setClassifyingId(id);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/clients/${id}/classify`,
        {},
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      toast.success('IA: ' + response.data.approach);
      fetchClients();
    } catch (error) {
      toast.error('Erro na IA: ' + error.message);
    } finally {
      setClassifyingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'lead':
        return 'bg-bv-surface-muted text-bv-muted border-[var(--line)]';
      case 'contact':
        return 'bg-bv-surface-muted text-bv-text border-[var(--line)]';
      case 'negotiation':
        return 'bg-bv-green/10 text-bv-green border-bv-green/20';
      case 'closed':
        return 'border-bv-green bg-bv-green font-bold text-black';
      case 'lost':
        return 'bg-bv-surface-muted text-bv-muted border-[var(--line-subtle)]';
      default:
        return 'bg-bv-surface-muted text-bv-muted border-[var(--line-subtle)]';
    }
  };

  useRegisterAppToolbar(
    () => (
      <PageToolbar title={crm.officialName} subtitle={crm.tagline} />
    ),
    []
  );

  useRegisterAppFab(
    () => (
      <ModuleFabButton
        aria-label="Novo cliente"
        title="Novo Cliente"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={24} strokeWidth={2} />
      </ModuleFabButton>
    ),
    []
  );

  const emptySearch = searchTerm.trim() && clients.length > 0 && filteredClients.length === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        <div className="group relative min-w-0 flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-bv-muted transition-colors group-focus-within:text-bv-green"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="input-field h-12 pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-outline h-12 w-full shrink-0 gap-2 px-4 md:w-auto">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      {/* Mobile: cartões (sem scroll horizontal) */}
      <div className="md:hidden">
        {loading ? (
          <div className="glass rounded-2xl py-14 text-center text-bv-muted">
            <Loader2 className="mx-auto mb-4 animate-spin text-bv-green" size={32} />
            Carregando leads...
          </div>
        ) : clients.length === 0 ? (
          <div className="glass rounded-2xl py-14 text-center text-bv-muted">
            <Users className="mx-auto mb-4 opacity-10" size={56} />
            <p className="font-display text-lg font-medium text-bv-text">Vácuo de Oportunidades</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-bv-muted">
              Nenhum lead detectado. Adicione seu primeiro contato para iniciar a análise.
            </p>
          </div>
        ) : emptySearch ? (
          <div className="glass rounded-2xl py-14 text-center text-bv-muted">
            <Search className="mx-auto mb-4 opacity-20" size={40} />
            <p className="font-medium text-bv-text">Nenhum resultado</p>
            <p className="mt-1 text-sm">Tente outro termo de busca.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredClients.map((client, i) => (
                <CRMClientMobileCard
                  key={client.id}
                  client={client}
                  index={i}
                  reduceMotion={reduceMotion}
                  getStatusColor={getStatusColor}
                  classifyingId={classifyingId}
                  onClassify={handleClassify}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden overflow-hidden rounded-2xl border glass md:block sm:rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--line-subtle)] bg-bv-surface-muted">
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-bv-text-soft">Cliente</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-bv-text-soft">Status</th>
                <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider text-bv-text-soft">Interesse</th>
                <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider text-bv-text-soft">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-bv-muted">
                    <Loader2 className="mx-auto mb-4 animate-spin text-bv-green" size={32} />
                    Carregando leads...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-bv-muted">
                    <Users className="mx-auto mb-4 opacity-10" size={64} />
                    <p className="font-display text-xl font-medium text-bv-text">Vácuo de Oportunidades</p>
                    <p className="mx-auto mt-2 max-w-xs text-bv-muted">
                      Nenhum lead detectado. Adicione seu primeiro contato para iniciar a análise.
                    </p>
                  </td>
                </tr>
              ) : emptySearch ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-bv-muted">
                    <Search className="mx-auto mb-4 opacity-20" size={40} />
                    <p className="font-medium text-bv-text">Nenhum resultado para esta busca</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredClients.map((client, i) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: reduceMotion ? 1 : 0, x: reduceMotion ? 0 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.95 }}
                      transition={{ delay: reduceMotion ? 0 : i * 0.05 }}
                      className="group transition-colors hover:bg-bv-surface-muted"
                    >
                      <td className="px-6 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bv-green/20 font-display font-bold text-bv-green">
                            {client.name[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-bv-text-soft">{client.name}</p>
                            <div className="mt-1 flex flex-col gap-0.5 text-xs text-bv-muted sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-1">
                              <span className="flex min-w-0 items-center gap-1">
                                <Mail size={10} className="shrink-0" />{' '}
                                <span className="truncate">{client.email || 'N/A'}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={10} className="shrink-0" /> {client.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(client.status)}`}
                        >
                          {client.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-bv-text-soft">{client.property_type || 'Qualquer'}</p>
                          <p className="text-xs text-bv-muted">{client.location || 'Sem localização'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleClassify(client.id)}
                            disabled={classifyingId === client.id}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-bv-green/20 text-bv-green transition-all hover:bg-bv-green/30"
                            title="IA: Análise Soberana"
                          >
                            {classifyingId === client.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Sparkles size={16} />
                            )}
                          </button>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-bv-surface-muted text-bv-muted transition-all hover:bg-bv-surface-strong hover:text-bv-text"
                          >
                            <MessageSquare size={16} />
                          </button>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-bv-surface-muted text-bv-muted transition-all hover:bg-bv-surface-strong hover:text-bv-text"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchClients} />
    </div>
  );
}
