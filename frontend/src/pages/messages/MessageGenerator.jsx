import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Send,
  Copy,
  MessageCircle,
  PhoneCall,
  AlertCircle,
  Loader2,
  Sparkles,
  User,
} from 'lucide-react';
import axios from 'axios';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { LEGACY_BV_MODULES } from '../../constants/brandModules';
import { useRegisterAppToolbar } from '../../contexts/AppToolbarContext';
import { PageToolbar } from '../../components/layout/PageToolbar';
import { BvModuleCanvas } from '../../components/layout/BvModuleCanvas';
import { useGlassBackdropStyle } from '../../hooks/useGlassBackdropStyle';

const flow = LEGACY_BV_MODULES.flow;

const FUNNEL_OPTIONS = [
  'Primeiro Contato',
  'Agendamento de Visita',
  'Pós-Visita',
  'Negociação',
  'Fechamento',
];

const PROPERTY_OPTIONS = ['Apartamento', 'Casa', 'Terreno', 'Lançamento'];

/** Mapeia tipo de imóvel do CRM para uma opção do select. */
function mapPropertyTypeToOption(raw) {
  if (!raw || typeof raw !== 'string') return 'Apartamento';
  const r = raw.toLowerCase();
  if (r.includes('apart')) return 'Apartamento';
  if (r.includes('casa')) return 'Casa';
  if (r.includes('terr')) return 'Terreno';
  if (r.includes('lanç') || r.includes('lanc') || r.includes('lançamento')) return 'Lançamento';
  return 'Apartamento';
}

const STATUS_TO_FUNNEL = {
  lead: 'Primeiro Contato',
  contact: 'Agendamento de Visita',
  negotiation: 'Negociação',
  closed: 'Fechamento',
  lost: 'Negociação',
};

export default function MessageGenerator() {
  const location = useLocation();
  const clientIdFromNav = location.state?.clientId;
  const { session, user } = useAuth();
  const glassBackdropStyle = useGlassBackdropStyle();
  const [loading, setLoading] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [linkedClient, setLinkedClient] = useState(null);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    funnelStage: 'Primeiro Contato',
    propertyType: 'Apartamento',
    tone: 'Profissional e Empático',
    additionalInfo: '',
  });

  const resolvedClientId = linkedClient?.id ?? clientIdFromNav ?? null;

  useEffect(() => {
    if (!clientIdFromNav || !user?.id) {
      setLinkedClient(null);
      return;
    }
    let cancelled = false;
    setLoadingClient(true);
    (async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientIdFromNav)
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .maybeSingle();

      if (cancelled) return;
      setLoadingClient(false);

      if (error || !data) {
        if (error) toast.error('Não foi possível carregar o cliente.');
        setLinkedClient(null);
        return;
      }

      setLinkedClient(data);
      const funnel = STATUS_TO_FUNNEL[data.status] ?? 'Primeiro Contato';
      const property = mapPropertyTypeToOption(data.property_type);
      const extra = [
        data.name && `Lead: ${data.name}`,
        data.phone && `Tel: ${data.phone}`,
        data.location && `Região: ${data.location}`,
        data.notes && `Notas: ${data.notes}`,
      ]
        .filter(Boolean)
        .join(' · ');

      setFormData((prev) => ({
        ...prev,
        funnelStage: funnel,
        propertyType: property,
        additionalInfo: extra || prev.additionalInfo,
      }));
    })();

    return () => {
      cancelled = true;
    };
  }, [clientIdFromNav, user?.id]);

  const clientBanner = useMemo(() => {
    if (!resolvedClientId) return null;
    if (loadingClient) {
      return (
        <div
          className="mb-6 flex items-center gap-3 rounded-card-2xl border border-[var(--line)] px-4 py-3 text-sm text-bv-muted"
          style={glassBackdropStyle}
        >
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          Carregando dados do lead…
        </div>
      );
    }
    if (!linkedClient) {
      return (
        <div
          className="mb-6 rounded-card-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-bv-text"
          style={glassBackdropStyle}
        >
          Lead não encontrado ou sem permissão. Ajuste os parâmetros manualmente.
        </div>
      );
    }
    return (
      <div
        className="mb-6 flex flex-col gap-2 rounded-card-2xl border border-bv-green/30 bg-bv-green/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        style={glassBackdropStyle}
      >
        <div className="flex min-w-0 items-center gap-2 text-sm text-bv-text">
          <User className="h-4 w-4 shrink-0 text-bv-green" />
          <span className="truncate">
            Scripts para: <strong>{linkedClient.name}</strong>
            {linkedClient.phone ? ` · ${linkedClient.phone}` : ''}
          </span>
        </div>
      </div>
    );
  }, [resolvedClientId, loadingClient, linkedClient, glassBackdropStyle]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages/generate`,
        {
          ...formData,
          clientId: resolvedClientId || undefined,
        },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      setResult(response.data);
      toast.success('Scripts gerados com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  useRegisterAppToolbar(
    () => <PageToolbar title={flow.officialName} />,
    []
  );

  return (
    <BvModuleCanvas>
      <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {clientBanner}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bv-scroll-root space-y-6 rounded-card-3xl border border-[var(--line)] glass p-card-4 sm:p-card-6 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto xl:top-24">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-bv-muted">Etapa do Funil</label>
                <select
                  className="input-field"
                  value={formData.funnelStage}
                  onChange={(e) => setFormData({ ...formData, funnelStage: e.target.value })}
                >
                  {FUNNEL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-bv-muted">Tipo de Imóvel</label>
                <select
                  className="input-field"
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                >
                  {PROPERTY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-bv-muted">Tom de Voz</label>
                <select
                  className="input-field"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                >
                  <option>Estratégico e Preciso</option>
                  <option>Soberano e Autoritário</option>
                  <option>Urgente e Exclusivo</option>
                  <option>Diplomático e Técnico</option>
                  <option>Profissional e Empático</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-bv-muted">Detalhes Adicionais</label>
                <textarea 
                  className="input-field min-h-[100px] py-3"
                  placeholder="Ex: O cliente tem pressa pois está se mudando de cidade..."
                  value={formData.additionalInfo}
                  onChange={e => setFormData({...formData, additionalInfo: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full h-12 gap-2 text-black font-bold"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                Processar Scripts
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-6">
          {!result ? (
            <div className="glass-card h-[600px] flex flex-col items-center justify-center text-center p-card-8 border-[1px] border-dashed border-[var(--line-subtle)]">
              <div className="w-16 h-16 rounded-card-2xl bg-bv-surface-muted flex items-center justify-center text-bv-muted mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2 text-bv-text">Pronto para a Corrente de Vendas</h3>
              <p className="text-bv-muted max-w-xs">Defina os parâmetros ao lado para gerar o fluxo de comunicação soberana.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              {/* WhatsApp Card */}
              <div className="glass-card p-card-6 border-l-2 border-bv-green">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-bv-green font-bold">
                    <MessageCircle size={20} />
                    WHATSAPP ESTRATÉGICO
                  </div>
                  <button onClick={() => copyToClipboard(result.whatsapp)} className="btn-icon">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-bv-muted leading-relaxed whitespace-pre-wrap">{result.whatsapp}</p>
              </div>

              {/* Call Script Card */}
              <div className="glass-card p-card-6 border-l-2 border-[var(--line)]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-bv-muted font-bold">
                    <PhoneCall size={20} />
                    SCRIPT DE CONEXÃO
                  </div>
                  <button onClick={() => copyToClipboard(result.script)} className="btn-icon">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-bv-muted leading-relaxed whitespace-pre-wrap">{result.script}</p>
              </div>

              {/* Objection Killer Card */}
              <div className="glass-card p-card-6 border-l-2 border-bv-green">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-bv-green font-bold">
                    <AlertCircle size={20} />
                    MATADOR DE OBJEÇÃO
                  </div>
                  <button onClick={() => copyToClipboard(result.objection)} className="btn-icon">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-bv-muted leading-relaxed whitespace-pre-wrap">{result.objection}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </BvModuleCanvas>
  );
}
