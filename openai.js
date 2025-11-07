const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function askOpenAI(systemPrompt, userPrompt) {
  if (!OPENAI_API_KEY) return null;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400,
      temperature: 0.2
    })
  });
  if (!res.ok) throw new Error('OpenAI error');
  const data = await res.json();
  return data.choices?.[0]?.message?.content || null;
}

module.exports = { askOpenAI };
