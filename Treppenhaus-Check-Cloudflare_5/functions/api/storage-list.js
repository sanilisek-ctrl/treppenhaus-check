// Cloudflare Pages Function: /api/storage-list
// Lists all keys under a given prefix. Requires the same KV binding as /api/storage.js.

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env.TREPPENHAUS_KV;

  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (!kv) {
    return json({ error: 'KV namespace "TREPPENHAUS_KV" is not bound to this Pages project.' }, 500, cors);
  }

  if (request.method !== 'GET') {
    return json({ error: 'method not allowed' }, 405, cors);
  }

  try {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || '';
    let cursor;
    const keys = [];
    do {
      const result = await kv.list({ prefix, cursor, limit: 1000 });
      result.keys.forEach(k => keys.push(k.name));
      cursor = result.list_complete ? undefined : result.cursor;
    } while (cursor);
    return json({ keys }, 200, cors);
  } catch (err) {
    return json({ error: String(err && err.message ? err.message : err) }, 500, cors);
  }
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', ...(headers || {}) },
  });
}
