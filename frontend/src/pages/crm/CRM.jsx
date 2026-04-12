import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import EditClientModal from './EditClientModal';
import { CRMClientMobileCard } from './CRMClientMobileCard';
import { formatClientStatus } from './clientStatusLabel';
import axios from 'axios';
import { BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { useRegisterAppFab } from '../../contexts/AppFabContext';
import { PageToolbar } from '../../components/layout/PageToolbar';
import { ModuleFabButton } from '../../components/layout/ModuleFabButton';
import { BvModuleCanvas } from '../../components/layout/BvModuleCanvas';
import { useGlassBackdropStyle } from '../../hooks/useGlassBackdropStyle';

const MotionTableRow = motion.tr;

const crm = BV_MODULES.crm;

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'lead', label: formatClientStatus('lead') },
  { value: 'contact', label: formatClientStatus('contact') },
  { value: 'negotiation', label: formatClientStatus('negotiation') },
  { value: 'closed', label: formatClientStatus('closed') },
  { value: 'lost', label: formatClientStatus('lost') },
];

export default function CRM() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [classifyingId, setClassifyingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [menuClientId, setMenuClientId] = useState(null);
  const menuDesktopRef = useRef(null);
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const glassBackdropStyle = useGlassBackdropStyle();

  const fetchClients = useCallback(async () => {
    if (!user?.id) return;
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
  }, [user?.id]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (!menuClientId) return;
    const close = (e) => {
      if (menuDesktopRef.current && !menuDesktopRef.current.contains(e.target)) {
        setMenuClientId(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuClientId]);

  const filteredClients = useMemo(() => {
    let list = clients;
    if (statusFilter) {
      list = list.filter((c) => c.status === statusFilter);
    }
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => {
      const hay = [c.name, c.email, c.phone, c.property_type, c.location]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [clients, searchTerm, statusFilter]);

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

  const handleClientMessage = useCallback(
    (client) => {
      const clientId = client?.id;
      if (!clientId) return;
      navigate('/mensagens', { state: { clientId } });
    },
    [navigate]
  );

  const handleDeleteClient = useCallback(
    async (client) => {
      if (!user?.id || !client?.id) return;
      if (!window.confirm('Excluir este cliente? Ele será ocultado da lista.')) return;
      try {
        const { error } = await supabase
          .from('clients')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', client.id)
          .eq('user_id', user.id);
        if (error) throw error;
        toast.success('Cliente removido.');
        setMenuClientId(null);
        fetchClients();
      } catch (error) {
        toast.error('Erro ao excluir: ' + error.message);
      }
    },
    [user?.id, fetchClients]
  );

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
      <PageToolbar title={crm.officialName} />
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

  const emptyFiltered = clients.length > 0 && filteredClients.length === 0;

  return (
    <BvModuleCanvas>
      <div className="space-y-6">
      <div className="glass bv-card-hover flex flex-col gap-3 rounded-card-3xl p-card-4 sm:flex-row sm:items-center sm:gap-4" style={glassBackdropStyle}>
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
        <div className="flex h-12 w-full shrink-0 items-center gap-2 sm:w-auto sm:min-w-[200px]">
          <Filter size={18} className="shrink-0 text-bv-muted" aria-hidden />
          <label className="sr-only" htmlFor="crm-status-filter">
            Filtro por status
          </label>
          <select
            id="crm-status-filter"
            className="input-field h-12 flex-1 pr-8"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile: cartões (sem scroll horizontal) */}
      <div className="md:hidden">
        {loading ? (
          <div className="glass bv-card-hover rounded-card-3xl py-card-14 text-center text-bv-muted" style={glassBackdropStyle}>
            <Loader2 className="mx-auto mb-4 animate-spin text-bv-green" size={32} />
            Carregando leads...
          </div>
        ) : clients.length === 0 ? (
          <div className="glass bv-card-hover rounded-card-3xl py-card-14 text-center text-bv-muted" style={glassBackdropStyle}>
            <Users className="mx-auto mb-4 opacity-10" size={56} />
            <p className="font-display text-lg font-medium text-bv-text">Vácuo de Oportunidades</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-bv-muted">
              Nenhum lead detectado. Adicione seu primeiro contato para iniciar a análise.
            </p>
          </div>
        ) : emptyFiltered ? (
          <div className="glass bv-card-hover rounded-card-3xl py-card-14 text-center text-bv-muted" style={glassBackdropStyle}>
            <Search className="mx-auto mb-4 opacity-20" size={40} />
            <p className="font-medium text-bv-text">Nenhum resultado</p>
            <p className="mt-1 text-sm">Ajuste a busca ou o filtro de status.</p>
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
                  glassBackdropStyle={glassBackdropStyle}
                  onEdit={(c) => setEditClient(c)}
                  onDelete={handleDeleteClient}
                  onMessage={handleClientMessage}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Desktop: tabela */}
      <div
        className="glass bv-card-hover hidden overflow-hidden rounded-card-3xl md:block"
        style={glassBackdropStyle}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--line-subtle)] bg-bv-surface-muted">
                <th className="px-6 py-4 text-sm font-semibold text-bv-text-soft">Cliente</th>
                <th className="px-6 py-4 text-sm font-semibold text-bv-text-soft">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-bv-text-soft">Interesse</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-bv-text-soft">
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
                    <p className="font-display text-xl font-medium text-bv-text">Vácuo de oportunidades</p>
                    <p className="mx-auto mt-2 max-w-xs text-bv-muted">
                      Nenhum lead detectado. Adicione seu primeiro contato para iniciar a análise.
                    </p>
                  </td>
                </tr>
              ) : emptyFiltered ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-bv-muted">
                    <Search className="mx-auto mb-4 opacity-20" size={40} />
                    <p className="font-medium text-bv-text">Nenhum resultado para esta busca ou filtro</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredClients.map((client, i) => (
                    <MotionTableRow
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
                          {formatClientStatus(client.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-bv-text-soft">{client.property_type || 'Qualquer'}</p>
                          <p className="text-xs text-bv-muted">{client.location || 'Sem localização'}</p>
                        </div>
                      </td>
                      <td className="relative px-6 py-4 text-right">
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
                            onClick={() => handleClientMessage(client)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-bv-surface-muted text-bv-muted transition-all hover:bg-bv-surface-strong hover:text-bv-text"
                            title="Mensagens"
                          >
                            <MessageSquare size={16} />
                          </button>
                          <div className="relative" ref={menuClientId === client.id ? menuDesktopRef : undefined}>
                            <button
                              type="button"
                              onClick={() =>
                                setMenuClientId((id) => (id === client.id ? null : client.id))
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-bv-surface-muted text-bv-muted transition-all hover:bg-bv-surface-strong hover:text-bv-text"
                              title="Mais"
                              aria-expanded={menuClientId === client.id}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                            {menuClientId === client.id && (
                              <div
                                role="menu"
                                className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-xl border border-[var(--line)] bg-bv-surface py-1 shadow-lg"
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="block w-full px-4 py-2 text-left text-sm text-bv-text-soft hover:bg-bv-surface-muted"
                                  onClick={() => {
                                    setEditClient(client);
                                    setMenuClientId(null);
                                  }}
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-bv-surface-muted"
                                  onClick={() => handleDeleteClient(client)}
                                >
                                  Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </MotionTableRow>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchClients} />
      <EditClientModal
        client={editClient}
        isOpen={Boolean(editClient)}
        onClose={() => setEditClient(null)}
        onSuccess={fetchClients}
      />
      </div>
    </BvModuleCanvas>
  );
}
