import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';
import { FIREBASE } from './config.js';
let auth = null;
export function getFirebaseAuth() {
  if (!auth) auth = getAuth(initializeApp(FIREBASE));
  return auth;
}
export { GoogleAuthProvider, signInWithPopup, signInAnonymously, onAuthStateChanged, signOut };
