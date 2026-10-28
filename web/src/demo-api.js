// Static demo: a tiny in-browser stand-in for the Benny API. Sample data only; nothing is sent anywhere.
// The snapshot was captured from the real API (POST /v1/sample, GET /v1/state); dates are shifted to stay current.
import snapshot from './demo-state.json';
const KEY = 'benny-demo-v1';
const DAY = 86400000;
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
function shiftDates(v, days) {
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(Date.parse(v + 'T00:00:00Z') + days * DAY).toISOString().slice(0, 10);
  if (Array.isArray(v)) return v.map(x => shiftDates(x, days));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, shiftDates(x, days)]));
  return v;
}
function demoState() {
  const days = Math.round((Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - Date.parse(snapshot.capturedOn + 'T00:00:00Z')) / DAY);
  return shiftDates(snapshot.state, days);
}
function empty(onboarded) {
  const s = demoState();
  return { ...s, onboarded_at: onboarded ? Date.now() : null, accounts: [], purchases: [], evidence: [], credit_status: [], findings: [], imports: [], documents: [], plaid_items: [], invariants: null };
}
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const readOnly = () => json({ error: 'demo', message: 'This is the demo with sample data. Sign in to the full Benny app to save your own cards and purchases.' }, 403);

export async function demoFetch(url, opts = {}) {
  const u = new URL(url); const path = u.pathname; const method = (opts.method || 'GET').toUpperCase();
  const s = load();
  if (path === '/v1/state' && method === 'GET') return json(s.sample ? { ...demoState(), onboarded_at: s.onboarded || Date.now() } : empty(s.onboarded));
  if (path === '/v1/me') return json({ owner: 'demo' });
  if (path === '/v1/sample' && method === 'POST') { save({ ...s, sample: true, onboarded: s.onboarded || Date.now() }); return json({ ok: true, invariant_failures: [] }); }
  if (path === '/v1/sample' && method === 'DELETE') { save({ ...s, sample: false }); return json({ ok: true, invariant_failures: [] }); }
  if (path === '/v1/onboarded') { save({ ...s, onboarded: s.onboarded || Date.now() }); return json({ ok: true }); }
  if (path === '/v1/invariants') return json({ failures: [] });
  if (path.startsWith('/v1/claims/')) return readOnly();
  if (method === 'GET') return json({});
  return readOnly();
}
