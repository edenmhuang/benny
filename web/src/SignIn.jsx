import React from 'react';
import { useTheme } from './mana-shim.jsx';
import { getFirebaseAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from './firebase.js';

export default function SignIn() {
  const { theme } = useTheme(); const dark = theme === 'dark';
  const [err, setErr] = React.useState(null); const [busy, setBusy] = React.useState(false);
  const C = dark ? { bg: '#0C1511', ink: '#E3EBDC', muted: '#97A898', accent: '#86BC7A', accentInk: '#0C1511', line: 'rgba(227,235,220,0.2)' }
                 : { bg: '#F3F2E8', ink: '#16241C', muted: '#58675C', accent: '#1E6A48', accentInk: '#FFFFFF', line: 'rgba(22,36,28,0.22)' };
  const go = async fn => { setBusy(true); setErr(null); try { await fn(); } catch (e) { setErr(e.code === 'auth/popup-closed-by-user' ? null : (e.message || 'Sign-in failed')); } setBusy(false); };
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center p-6" style={{ background: C.bg, color: C.ink }}>
      <div className="w-full max-w-[380px] text-center">
        <div className="text-[13px] tracking-[0.2em] uppercase" style={{ color: C.muted }}>Benny</div>
        <h1 className="mt-3 text-[34px] leading-tight" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>Your cards already owe you something.</h1>
        <div className="mt-8 flex flex-col gap-2.5">
          <button disabled={busy} onClick={() => go(() => signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider()))}
            className="rounded-full px-5 py-3 text-[14px] font-medium transition-opacity hover:opacity-85 disabled:opacity-50" style={{ background: C.accent, color: C.accentInk }}>Continue with Google</button>
          <button disabled={busy} onClick={() => go(() => signInAnonymously(getFirebaseAuth()))}
            className="rounded-full px-5 py-3 text-[14px] font-medium transition-opacity hover:opacity-85 disabled:opacity-50" style={{ border: `1px solid ${C.line}` }}>Try it as a guest</button>
        </div>
        {err && <div className="mt-4 text-[12.5px]" style={{ color: dark ? '#E58468' : '#A23B2A' }}>{err}</div>}
        <div className="mt-6 text-[11.5px]" style={{ color: C.muted }}>Guest data stays tied to this browser.</div>
      </div>
    </div>
  );
}
