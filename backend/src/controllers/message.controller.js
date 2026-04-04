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

    // 1. Opcional: Buscar dados do cliente se clientId for fornecido
    let clientInfo = '';
    if (clientId) {
      const { data: client } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
      
      if (client) {
        clientInfo = `Cliente: ${client.name}. Perfil IA: ${client.ai_profile || 'N/A'}. Notas: ${client.notes || 'N/A'}`;
      }
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
        client_id: clientId || null,
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
