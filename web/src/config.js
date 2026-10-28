// Build-time configuration. No VITE_API_URL = static demo (sample data, nothing leaves the browser).
export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const DEMO = !API_URL;
export const DEMO_BASE = 'https://demo.benny.invalid';
export const FIREBASE = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
