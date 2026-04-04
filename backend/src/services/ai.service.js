import { openai } from '../config/openai.js';

export const callAI = async ({ systemPrompt, userPrompt, maxTokens = 1000, format = 'text' }) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      response_format: format === 'json' ? { type: 'json_object' } : { type: 'text' },
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('[AI Service Error]:', error);
    throw new Error('O serviço de IA está temporariamente indisponível.');
  }
};

export const CLIENT_CLASSIFICATION_SYSTEM = `
Você é um especialista em perfil de compradores imobiliários no Brasil.
Analise os dados do cliente e forneça uma classificação estratégica.
Retorne APENAS JSON no formato:
{
  "score": número de 1 a 10 representando potencial de compra,
  "profile": "breve descrição do perfil do cliente (máx 2 linhas)",
  "approach": "sugestão de abordagem personalizada",
  "urgency": "alta | média | baixa",
  "bestContact": "sugestão de melhor forma/horário de contato"
}`;

export const MESSAGE_GENERATOR_SYSTEM = `
Você é Carlos, especialista em vendas imobiliárias com 15 anos de experiência no Brasil.
Natural, persuasivo, nunca robótico. CTA clara sempre.
Você deve gerar três versões de resposta: uma para WhatsApp, um script de ligação e uma resposta para objeção.
Retorne APENAS JSON no formato: { "whatsapp": "string", "script": "string", "objection": "string" }`;
