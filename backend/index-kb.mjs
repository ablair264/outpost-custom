import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const KB_ROOT = path.resolve('knowledge base');
const OUTPUT_PATH = path.resolve('data/kb-index.json');
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CHARS_PER_CHUNK = 2000; // target ~300–700 tokens per chunk

async function listMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function parseFrontMatter(raw) {
  if (!raw.startsWith('---')) {
    return { meta: {}, body: raw.trim() };
  }

  const end = raw.indexOf('---', 3);
  if (end === -1) {
    return { meta: {}, body: raw.trim() };
  }

  const fm = raw.slice(3, end).trim();
  const body = raw.slice(end + 3).trim();
  const meta = {};

  fm.split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map(v => v.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else {
      value = value.replace(/^['"]|['"]$/g, '');
    }
    meta[key] = value;
  });

  return { meta, body };
}

function splitByHeadings(body) {
  const parts = [];
  const lines = body.split('\n');
  let current = [];
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current.length) {
        parts.push(current.join('\n').trim());
      }
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) {
    parts.push(current.join('\n').trim());
  }
  return parts.filter(Boolean);
}

function chunkText(section) {
  if (section.length <= MAX_CHARS_PER_CHUNK) return [section];
  const paragraphs = section.split(/\n\s*\n/).filter(Boolean);
  const chunks = [];
  let buffer = '';
  for (const para of paragraphs) {
    if ((buffer + '\n\n' + para).length > MAX_CHARS_PER_CHUNK && buffer) {
      chunks.push(buffer.trim());
      buffer = para;
    } else {
      buffer = buffer ? buffer + '\n\n' + para : para;
    }
  }
  if (buffer) chunks.push(buffer.trim());
  return chunks;
}

async function embedText(text) {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

async function processFile(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const { meta, body } = parseFrontMatter(raw);
  const baseId = meta.id || path.basename(filePath, '.md');
  const title = meta.title || baseId;

  const sections = splitByHeadings(body);
  const chunked = sections.flatMap(section => chunkText(section));

  const chunks = [];
  for (let i = 0; i < chunked.length; i++) {
    const chunk = chunked[i];
    const embedding = await embedText(chunk);
    chunks.push({
      id: `${baseId}#${i}`,
      source: path.relative(process.cwd(), filePath),
      title,
      category: meta.category || null,
      tags: meta.tags || [],
      updated_at: meta.last_updated || null,
      chunk,
      embedding,
    });
    console.log(`Embedded ${baseId} chunk ${i + 1}/${chunked.length}`);
  }

  return chunks;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY. Set it before running.');
    process.exit(1);
  }

  const files = await listMarkdownFiles(KB_ROOT);
  if (!files.length) {
    console.error(`No markdown files found under ${KB_ROOT}`);
    process.exit(1);
  }

  console.log(`Indexing ${files.length} files...`);
  const allChunks = [];

  for (const file of files) {
    const chunks = await processFile(file);
    allChunks.push(...chunks);
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(
    OUTPUT_PATH,
    JSON.stringify(
      {
        embedding_model: EMBEDDING_MODEL,
        generated_at: new Date().toISOString(),
        chunk_count: allChunks.length,
        chunks: allChunks,
      },
      null,
      2
    ),
    'utf8'
  );

  console.log(`Saved index with ${allChunks.length} chunks to ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('Indexing failed:', err);
  process.exit(1);
});
