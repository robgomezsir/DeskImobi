import { useState } from 'react';
import { 
  Send, 
  Copy, 
  RefreshCw, 
  MessageCircle, 
  PhoneCall, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function MessageGenerator() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    funnelStage: 'Primeiro Contato',
    propertyType: 'Apartamento',
    tone: 'Profissional e Empático',
    additionalInfo: ''
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/messages/generate`,
        formData,
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-white">BV Flow</h1>
          <p className="text-bv-white-ghost">Trabalhe menos. Produza mais.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="glass p-6 rounded-3xl space-y-6 sticky top-24">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Etapa do Funil</label>
                <select 
                  className="input-field"
                  value={formData.funnelStage}
                  onChange={e => setFormData({...formData, funnelStage: e.target.value})}
                >
                  <option>Primeiro Contato</option>
                  <option>Agendamento de Visita</option>
                  <option>Pós-Visita</option>
                  <option>Negociação</option>
                  <option>Fechamento</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Tipo de Imóvel</label>
                <select 
                  className="input-field"
                  value={formData.propertyType}
                  onChange={e => setFormData({...formData, propertyType: e.target.value})}
                >
                  <option>Apartamento</option>
                  <option>Casa</option>
                  <option>Terreno</option>
                  <option>Lançamento</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Tom de Voz</label>
                <select 
                  className="input-field"
                  value={formData.tone}
                  onChange={e => setFormData({...formData, tone: e.target.value})}
                >
                  <option>Estratégico e Preciso</option>
                  <option>Soberano e Autoritário</option>
                  <option>Urgente e Exclusivo</option>
                  <option>Diplomático e Técnico</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Detalhes Adicionais</label>
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
            <div className="glass-card h-[600px] flex flex-col items-center justify-center text-center p-8 border-dashed border-2 border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-700 mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-medium mb-2 text-bv-white">Pronto para a Corrente de Vendas</h3>
              <p className="text-bv-white-ghost max-w-xs">Defina os parâmetros ao lado para gerar o fluxo de comunicação soberana.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
              {/* WhatsApp Card */}
              <div className="glass-card p-6 border-l-4 border-bv-green">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-bv-green font-bold">
                    <MessageCircle size={20} />
                    WHATSAPP ESTRATÉGICO
                  </div>
                  <button onClick={() => copyToClipboard(result.whatsapp)} className="btn-icon">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-bv-white-ghost leading-relaxed whitespace-pre-wrap">{result.whatsapp}</p>
              </div>

              {/* Call Script Card */}
              <div className="glass-card p-6 border-l-4 border-white/40">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-white/60 font-bold">
                    <PhoneCall size={20} />
                    SCRIPT DE CONEXÃO
                  </div>
                  <button onClick={() => copyToClipboard(result.script)} className="btn-icon">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-bv-white-ghost leading-relaxed whitespace-pre-wrap">{result.script}</p>
              </div>

              {/* Objection Killer Card */}
              <div className="glass-card p-6 border-l-4 border-orange-500">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-orange-500 font-bold">
                    <AlertCircle size={20} />
                    MATADOR DE OBJEÇÃO
                  </div>
                  <button onClick={() => copyToClipboard(result.objection)} className="btn-icon">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{result.objection}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
