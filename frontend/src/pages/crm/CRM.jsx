import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  Sparkles
} from 'lucide-react';
import AddClientModal from './AddClientModal';
import axios from 'axios'; // For backend AI call

export default function CRM() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classifyingId, setClassifyingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, session } = useAuth();

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

  const handleClassify = async (id) => {
    setClassifyingId(id);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/clients/${id}/classify`,
        {},
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      toast.success('IA: ' + response.data.approach);
      fetchClients(); // Refresh to see AI notes
    } catch (error) {
      toast.error('Erro na IA: ' + error.message);
    } finally {
      setClassifyingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'lead': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'contact': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'negotiation': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'closed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'lost': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">CRM Clientes</h1>
          <p className="text-gray-400">Gerencie seus leads e oportunidades de negócio</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary h-12 px-6"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome, e-mail ou telefone..." 
            className="input-field pl-12 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline h-12 px-4 gap-2">
          <Filter size={18} />
          Filtros
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Interesse</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="animate-spin mx-auto mb-4 text-primary-500" size={32} />
                    Carregando leads...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-gray-500">
                    <Users className="mx-auto mb-4 opacity-20" size={64} />
                    <p className="text-xl font-display font-medium text-gray-400">Nenhum cliente cadastrado</p>
                    <p className="max-w-xs mx-auto mt-2">Comece adicionando seu primeiro lead para gerenciar seu funil de vendas.</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {clients.map((client, i) => (
                    <motion.tr 
                      key={client.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center font-bold font-display">
                            {client.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-100">{client.name}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Mail size={10} /> {client.email || 'N/A'}</span>
                              <span className="flex items-center gap-1"><Phone size={10} /> {client.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(client.status)}`}>
                          {client.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-300">{client.property_type || 'Qualquer'}</p>
                          <p className="text-gray-500 text-xs">{client.location || 'Sem localização'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleClassify(client.id)}
                            disabled={classifyingId === client.id}
                            className="w-8 h-8 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 flex items-center justify-center text-primary-400 transition-all"
                            title="Classificar com IA"
                          >
                            {classifyingId === client.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                            <MessageSquare size={16} />
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
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

      <AddClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchClients} 
      />
    </div>
  );
}
