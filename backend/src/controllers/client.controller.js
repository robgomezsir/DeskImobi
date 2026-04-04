import { supabaseAdmin } from '../config/supabase.js';
import { callAI, CLIENT_CLASSIFICATION_SYSTEM } from '../services/ai.service.js';

export const getClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const userId = req.user.id;

    let query = supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .is('deleted_at', null);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      clients: data,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createClient = async (req, res) => {
  try {
    const userId = req.user.id;
    const clientData = { ...req.body, user_id: userId };

    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('clients')
      .update(req.body)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await supabaseAdmin
      .from('clients')
      .update({ deleted_at: new Date() })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const classifyClient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1. Buscar dados do cliente
    const { data: client, error: fetchError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !client) throw new Error('Cliente não encontrado');

    // 2. Preparar prompt para IA
    const userPrompt = `Analise este cliente imobiliário:
    Nome: ${client.name}
    E-mail: ${client.email}
    Telefone: ${client.phone}
    Interesse: ${client.property_type || 'Não especificado'}
    Localização: ${client.location || 'Não especificada'}
    Status atual: ${client.status}
    Notas/Perfil: ${client.notes || 'Sem notas adicionais'}`;

    // 3. Chamar IA
    const aiResult = await callAI({
      systemPrompt: CLIENT_CLASSIFICATION_SYSTEM,
      userPrompt,
      format: 'json'
    });

    const parsedResult = JSON.parse(aiResult);

    // 4. Salvar resultado no banco
    const { data: updatedClient, error: updateError } = await supabaseAdmin
      .from('clients')
      .update({
        ai_profile: parsedResult.profile,
        ai_score: parsedResult.score,
        notes: `IA Insight: Urgência ${parsedResult.urgency}. ${parsedResult.approach}`
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({
      ...parsedResult,
      updatedRecord: updatedClient
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
