import type { ChatResponse } from '../src/types';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { message } = await req.json();
  if (!message) {
    res.status(400).json({ error: 'Missing message' });
    return;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OpenAI API key not configured' });
    return;
  }
  const systemPrompt = process.env.SYSTEM_PROMPT || `You are a helpful assistant that provides up to three English words with meanings and short example sentences in Korean, and then asks one review quiz question. Provide answers in Korean within 5 sentences.`;
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    max_tokens: 500,
  };
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errText = await response.text();
      res.status(500).json({ error: `OpenAI error: ${response.status} ${errText}` });
      return;
    }
    const data = await response.json();
    const reply = data.choices[0].message.content as string;
    const result: ChatResponse = { reply };
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
};
