// Lightweight, token-efficient LLM client wrapper.
// - Respects env flags to avoid calling remote LLM when not configured
// - Caches recent results
// - Truncates and compresses context (only uses last N comments)

type AssetMinimal = { id: string; name: string; price: number; change: string };

const MEMORY_CACHE_KEY = 'mp_llm_cache_v1';
const inMemCache = new Map<string, { ts: number; v: string }>();

function hashComments(comments: Array<any>, limit = 5) {
  return comments
    .slice(-limit)
    .map((c) => `${c.user || ''}:${(c.text || '').slice(0,80)}`)
    .join('|');
}

function loadPersistentCache(): Record<string, { ts: number; v: string }> {
  try {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(MEMORY_CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function savePersistentCache(data: Record<string, { ts: number; v: string }>) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MEMORY_CACHE_KEY, JSON.stringify(data));
  } catch {}
}

const TELEMETRY_KEY = 'mp_llm_telemetry_v1';
const inMemTelemetry: { calls: number; failures: number; lastCall?: number } = { calls: 0, failures: 0 };

function loadTelemetry() {
  try {
    if (typeof window === 'undefined') return { calls: 0, failures: 0 };
    const raw = localStorage.getItem(TELEMETRY_KEY);
    if (!raw) return { calls: 0, failures: 0 };
    return JSON.parse(raw);
  } catch {
    return { calls: 0, failures: 0 };
  }
}

function saveTelemetry(t: { calls: number; failures: number; lastCall?: number }) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(t));
  } catch {}
}

function incrementRemoteCall() {
  try {
    const t = { ...loadTelemetry() } as any;
    t.calls = (t.calls || 0) + 1;
    t.lastCall = Date.now();
    saveTelemetry(t);
    inMemTelemetry.calls = t.calls;
    inMemTelemetry.lastCall = t.lastCall;
  } catch {}
}

function incrementFailure() {
  try {
    const t = { ...loadTelemetry() } as any;
    t.failures = (t.failures || 0) + 1;
    saveTelemetry(t);
    inMemTelemetry.failures = t.failures;
  } catch {}
}

function localSummarize(asset: AssetMinimal, comments: Array<any>) {
  const last = comments.slice(-3).map((c) => `${c.user || 'anon'}: ${(c.text || '').slice(0, 90)}`);
  // quick sentiment heuristic
  const posWords = ['bull', 'buy', 'long', 'accumul', 'strength', 'breakout', 'moon', 'target'];
  const negWords = ['bear', 'sell', 'short', 'dump', 'panic', 'weak', 'resist', 'flush'];
  let pos = 0, neg = 0;
  for (const c of comments.slice(-10)) {
    const t = (c.text || '').toLowerCase();
    for (const w of posWords) if (t.includes(w)) pos++;
    for (const w of negWords) if (t.includes(w)) neg++;
  }
  const majority = pos === neg ? 'Neutral' : pos > neg ? 'Positive' : 'Negative';
  return `${asset.name} $${asset.price.toFixed(2)} (${asset.change}) — Sentiment: ${majority}. ${last.length ? `Recent: ${last.join(' | ')}` : 'No recent comments.'}`;
}

export async function analyzeAssetSummary(
  asset: AssetMinimal,
  comments: Array<any>,
  opts?: { model?: string; maxTokens?: number }
): Promise<string> {
  const enabled = import.meta.env.VITE_ENABLE_LLM === 'true';
  const endpoint = import.meta.env.VITE_LLM_ENDPOINT || '';
  const model = opts?.model || import.meta.env.VITE_LLM_MODEL || 'gpt-4.1';
  const maxTokens = opts?.maxTokens || Number(import.meta.env.VITE_LLM_MAX_TOKENS) || 80; // smaller

  const priceDeltaThreshold = Number(import.meta.env.VITE_LLM_PRICE_DELTA_PERCENT) || 0.5; // percent
  const commentDeltaThreshold = Number(import.meta.env.VITE_LLM_COMMENT_DELTA) || 3; // new comments
  const cacheTTL = Number(import.meta.env.VITE_LLM_CACHE_TTL_SEC) || 600;

  const commentsHash = hashComments(comments, 5);
  const cacheKey = `${asset.id}:${Math.round(asset.price)}:${commentsHash}:${model}:${maxTokens}`;

  // check in-memory first
  const mem = inMemCache.get(cacheKey);
  if (mem && (Date.now() - mem.ts) / 1000 < cacheTTL) return mem.v;

  // check persistent cache
  const persisted = loadPersistentCache();
  if (persisted[cacheKey] && (Date.now() - persisted[cacheKey].ts) / 1000 < cacheTTL) {
    inMemCache.set(cacheKey, persisted[cacheKey]);
    return persisted[cacheKey].v;
  }

  // If remote not enabled or no endpoint, return fast local summary
  if (!enabled || !endpoint) {
    const local = localSummarize(asset, comments);
    const entry = { ts: Date.now(), v: local };
    inMemCache.set(cacheKey, entry);
    const all = loadPersistentCache(); all[cacheKey] = entry; savePersistentCache(all);
    return local;
  }

  // Gating: call remote only if price moved or enough new comments
  try {
    const persistedMetaKey = `${asset.id}:meta`;
    const metaStore = loadPersistentCache();
    const meta = (metaStore[persistedMetaKey] && JSON.parse(metaStore[persistedMetaKey].v)) || { price: asset.price, commentsHash };
    const pricePct = Math.abs((asset.price - (meta.price || asset.price)) / (meta.price || asset.price)) * 100;
    const commentChanged = commentsHash !== (meta.commentsHash || '');
    const newCommentsCount = commentChanged ? commentDeltaThreshold : 0; // approximate

    const needRemote = pricePct >= priceDeltaThreshold || (commentChanged && comments.length >= commentDeltaThreshold);
    if (!needRemote) {
      const local = localSummarize(asset, comments);
      const entry = { ts: Date.now(), v: local };
      inMemCache.set(cacheKey, entry);
      const all = loadPersistentCache(); all[cacheKey] = entry; savePersistentCache(all);
      // update meta
      all[persistedMetaKey] = { ts: Date.now(), v: JSON.stringify({ price: asset.price, commentsHash }) };
      savePersistentCache(all);
      return local;
    }

    // Remote call path (small prompt)
    const last = comments.slice(-3).map((c, i) => `${i + 1}. ${c.user || 'anon'}: ${(c.text || '').replace(/[\n\r]+/g, ' ').slice(0, 160)}`);
    const prompt = `Summarize ${asset.name} (${asset.id}) in 1-2 short sentences, include sentiment and one concise insight. Price: $${asset.price.toFixed(2)} (${asset.change}). Comments:\n${last.join('\n')}\nSummary:`;

    // record that we're attempting a remote call (no prompt content stored)
    incrementRemoteCall();

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, max_tokens: maxTokens }),
    });
    const data = await res.json();
    const text = (data?.text) || (data?.choices?.[0]?.text) || (data?.choices?.[0]?.message?.content) || JSON.stringify(data);
    const out = (text || '').toString().trim() || localSummarize(asset, comments);

    const entry = { ts: Date.now(), v: out };
    inMemCache.set(cacheKey, entry);
    const all = loadPersistentCache(); all[cacheKey] = entry;
    // update meta
    all[persistedMetaKey] = { ts: Date.now(), v: JSON.stringify({ price: asset.price, commentsHash }) };
    savePersistentCache(all);
    return out;
  } catch (err) {
    // record failure for telemetry
    incrementFailure();
    const fallback = localSummarize(asset, comments) + ' (AI failed)';
    const entry = { ts: Date.now(), v: fallback };
    inMemCache.set(cacheKey, entry);
    const all = loadPersistentCache(); all[cacheKey] = entry; savePersistentCache(all);
    return fallback;
  }
}

export function clearLlmCache() { inMemCache.clear(); try { if (typeof window !== 'undefined') localStorage.removeItem(MEMORY_CACHE_KEY); } catch {} }

export function getLlmTelemetry() {
  try {
    const t = loadTelemetry();
    return { ...t, runtime: inMemTelemetry };
  } catch { return { calls: 0, failures: 0, runtime: inMemTelemetry } }
}

export function resetLlmTelemetry() {
  try { if (typeof window !== 'undefined') localStorage.removeItem(TELEMETRY_KEY); inMemTelemetry.calls = 0; inMemTelemetry.failures = 0; } catch {}
}
