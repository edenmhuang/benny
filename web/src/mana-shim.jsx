// Replaces the Mana runtime the Benny+ component was written for (FS, useTheme, relPathAddress, ...).
// Standalone: rules + engine are bundled files, the API URL comes from build config, auth is Firebase Auth.
import React from 'react';
import rulesJson from '../../api/bundle/rules.snapshot.json?raw';
import engineCode from '../../api/bundle/engine.js?raw';
import manifest from '../../api/bundle/manifest.json';
import { API_URL, DEMO, DEMO_BASE } from './config.js';
import { demoFetch } from './demo-api.js';

export { React };
const demoUser = { uid: 'demo', isAnonymous: true, getIdToken: async () => 'demo' };
let currentAuth = { currentUser: DEMO ? demoUser : null };
export function setAuth(a) { currentAuth = a; }

// Virtual tree for the few app-owned paths the component reads.
const VIRTUAL = {
  'app/bundle': { ...manifest, rulesJson, engineCode },
  'app/service': { url: DEMO ? DEMO_BASE : API_URL },
};
const snap = v => ({ val: () => (v === undefined ? null : v), exists: () => v != null });
export const FS = {
  get auth() { return currentAuth; },
  db: {},
  ref: (_db, path) => ({ path }),
  onValue: (ref, cb) => { const t = setTimeout(() => cb(snap(VIRTUAL[ref.path])), 0); return () => clearTimeout(t); },
  get: async ref => snap(VIRTUAL[ref.path]),
  update: async () => {},
};
export const relPathAddress = (...segs) => ['app', ...segs.flat()].join('/');
export const ownerId = 'standalone';
export let userId = DEMO ? 'demo' : null;
export function setUserId(u) { userId = u; }
export const API_BASE_URL = '';

export const fetch = (input, opts) => {
  const url = typeof input === 'string' ? input : input.url;
  if (url.startsWith(DEMO_BASE)) return demoFetch(url, opts);
  return window.fetch(input, opts);
};

const ThemeCtx = React.createContext(null);
export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState(() => {
    try { const s = localStorage.getItem('benny-theme'); if (s) return s; } catch (e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  React.useEffect(() => { try { localStorage.setItem('benny-theme', theme); } catch (e) {} document.documentElement.style.colorScheme = theme; }, [theme]);
  const value = React.useMemo(() => ({ theme, setTheme, toggleTheme: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')), isAuto: false }), [theme]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
export const useTheme = () => React.useContext(ThemeCtx);

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return 'copied'; } catch (e) {
    try { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); return 'copied'; } catch (e2) { return 'failed'; }
  }
}
// Features that depend on Mana's platform (Gmail through Mana's Google connection, the sandbox shopping browser) are off here.
export const useSymbolicProxyUrl = () => ({ url: undefined, wsUrl: undefined, error: { message: 'Not available in the standalone app' } });
export const useManaRouter = () => ({ url: undefined, wsUrl: undefined, error: { message: 'Not available in the standalone app' } });
export const ManaBrowser = () => null;
export const checkOAuthStatus = async () => false;
export const connectGoogleOAuth = (_u, h) => h && h.onError && h.onError(new Error('Not available in the standalone app'));
