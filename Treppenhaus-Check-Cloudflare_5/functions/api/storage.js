// Cloudflare Pages Function: /api/storage
// Handles GET (read one key), POST (write one key), DELETE (remove one key).
// Requires a KV namespace bound to this Pages project as "TREPPENHAUS_KV"
// (Cloudflare dashboard -> your Pages project -> Settings -> Functions -> KV namespace bindings).

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env.TREPPENHAUS_KV;

  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (!kv) {
    return json({ error: 'KV namespace "TREPPENHAUS_KV" is not bound to this Pages project.' }, 500, cors);
  }

  const url = new URL(request.url);

  try {
    if (request.method === 'GET') {
      const key = url.searchParams.get('key');
      if (!key) return json({ error: 'key required' }, 400, cors);
      const value = await kv.get(key);
      if (value === null) return json({ error: 'not found' }, 404, cors);
      return json({ key, value }, 200, cors);
    }

    if (request.method === 'POST') {
      const body = await request.json();
      if (!body || !body.key) return json({ error: 'key required' }, 400, cors);
      await kv.put(body.key, body.value);
      return json({ key: body.key, value: body.value }, 200, cors);
    }

    if (request.method === 'DELETE') {
      const key = url.searchParams.get('key');
      if (!key) return json({ error: 'key required' }, 400, cors);
      await kv.delete(key);
      return json({ deleted: true }, 200, cors);
    }

    return json({ error: 'method not allowed' }, 405, cors);
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
