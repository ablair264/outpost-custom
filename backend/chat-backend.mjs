import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const CHAT_MODEL = process.env.CHAT_MODEL || 'gpt-4o-mini';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const KB_INDEX_PATH = path.resolve('data/kb-index.json');
const PORT = process.env.PORT || process.env.CHAT_BACKEND_PORT || 3002;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let kbIndex = null;

async function loadIndex() {
  try {
    const raw = await fs.readFile(KB_INDEX_PATH, 'utf8');
    kbIndex = JSON.parse(raw);
    console.log(`Loaded KB index with ${kbIndex.chunk_count || kbIndex.chunks?.length || 0} chunks`);
  } catch (err) {
    console.warn(`Unable to load KB index at ${KB_INDEX_PATH}. Run "npm run kb:index" first.`, err.message);
    kbIndex = null;
  }
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let aMag = 0;
  let bMag = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    aMag += a[i] * a[i];
    bMag += b[i] * b[i];
  }
  return dot / (Math.sqrt(aMag) * Math.sqrt(bMag));
}

async function embedQuery(text) {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

app.get('/api/chat/health', (_req, res) => {
  if (!kbIndex) {
    return res.status(500).json({ ok: false, error: 'KB index not loaded. Run npm run kb:index.' });
  }
  return res.json({ ok: true, chunks: kbIndex.chunks?.length || 0 });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body || {};

    if (!kbIndex) {
      return res.status(500).json({ error: 'KB index not loaded. Run "npm run kb:index" first.' });
    }
    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const queryEmbedding = await embedQuery(message);
    const scored = kbIndex.chunks
      .map(chunk => ({
        ...chunk,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const context = scored
      .map(
        c =>
          `Source: ${c.title || c.source} (${c.source})\n` +
          `${c.chunk}`
      )
      .join('\n\n');

    const systemPrompt = `
You are an Outpost Custom live chat assistant. Use only the provided knowledge base excerpts to answer.
- Cite sources inline as [source:TITLE] where TITLE is the front-matter title or file name.
- If the context is insufficient or off-topic, ask a clarifying question or offer to connect to a human.
- Keep responses concise and practical; include steps, options, or pricing ranges when available.
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: `User message: ${message}\n\nRelevant context:\n${context}` },
    ];

    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 400,
    });

    const reply = completion.choices[0].message.content;

    res.json({
      reply,
      sources: scored.map(({ id, title, source, score }) => ({
        id,
        title,
        source,
        score,
      })),
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed', detail: err.message });
  }
});

app.listen(PORT, async () => {
  await loadIndex();
  console.log(`KB chat backend running on port ${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/chat`);
});
