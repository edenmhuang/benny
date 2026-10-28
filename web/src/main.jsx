import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider, setAuth, setUserId } from './mana-shim.jsx';
import { DEMO, FIREBASE } from './config.js';
import BennyApp from './BennyApp.jsx';
const SignIn = React.lazy(() => import('./SignIn.jsx'));

function Root() {
  const [user, setUser] = React.useState(DEMO ? { uid: 'demo' } : undefined);
  React.useEffect(() => {
    if (DEMO) return;
    let unsub = () => {};
    import('./firebase.js').then(({ getFirebaseAuth, onAuthStateChanged }) => {
      const auth = getFirebaseAuth(); setAuth(auth);
      unsub = onAuthStateChanged(auth, u => { setUserId(u ? u.uid : null); setUser(u || null); });
    });
    return () => unsub();
  }, []);
  if (!DEMO && !FIREBASE.apiKey) return <div style={{ padding: 32, fontFamily: 'system-ui' }}>Missing Firebase config. Set the VITE_FIREBASE_* variables (see web/.env.example).</div>;
  if (user === undefined) return null;
  if (!user) return <React.Suspense fallback={null}><SignIn /></React.Suspense>;
  return (
<BennyApp key={user.uid} />
  );
}

createRoot(document.getElementById('root')).render(<ThemeProvider><Root /></ThemeProvider>);
