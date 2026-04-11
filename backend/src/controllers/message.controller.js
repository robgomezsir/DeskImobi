import { callAI, MESSAGE_GENERATOR_SYSTEM } from '../services/ai.service.js';
import { supabaseAdmin } from '../config/supabase.js';

export const generateMessage = async (req, res) => {
  try {
    const { 
      clientId, 
      funnelStage, 
      propertyType, 
      tone, 
      additionalInfo 
    } = req.body;
    const userId = req.user.id;

    // 1. Opcional: dados do cliente — obrigatório pertencer ao utilizador autenticado (service role ignora RLS)
    let clientInfo = '';
    let resolvedClientId = null;
    if (clientId) {
      const { data: client } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .eq('user_id', userId)
        .is('deleted_at', null)
        .maybeSingle();

      if (!client) {
        return res.status(403).json({
          error: 'Cliente não encontrado ou sem permissão para este utilizador.',
        });
      }

      resolvedClientId = client.id;
      clientInfo = `Cliente: ${client.name}. Perfil IA: ${client.ai_profile || 'N/A'}. Notas: ${client.notes || 'N/A'}`;
    }

    // 2. Preparar prompt
    const userPrompt = `Gere scripts de venda para:
    ${clientInfo}
    Etapa do Funil: ${funnelStage}
    Tipo de Imóvel: ${propertyType}
    Tom de voz: ${tone}
    Contexto adicional: ${additionalInfo || 'Nenhum'}`;

    // 3. Chamar IA
    const aiResult = await callAI({
      systemPrompt: MESSAGE_GENERATOR_SYSTEM,
      userPrompt,
      format: 'json'
    });

    const parsedResult = JSON.parse(aiResult);

    // 4. Salvar no histórico de mensagens
    const { data: savedMessage, error: saveError } = await supabaseAdmin
      .from('messages')
      .insert([{
        user_id: userId,
        client_id: resolvedClientId,
        funnel_stage: funnelStage,
        tone: tone,
        property_type: propertyType,
        whatsapp: parsedResult.whatsapp,
        script: parsedResult.script,
        objection: parsedResult.objection
      }])
      .select()
      .single();

    if (saveError) throw saveError;

    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessageHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*, clients(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
