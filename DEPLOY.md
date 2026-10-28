# Deploying Benny

Pushing to `main` redeploys automatically once these are connected.

## 1. Demo site (about 5 minutes, free)

1. Go to [vercel.com/new](https://vercel.com/new) and import `edenmhuang/benny`.
2. Leave **Root Directory** as the repo root (settings come from `vercel.json`). Add **no** environment variables.
3. Deploy. You get a public URL with sample data and no sign-in.

## 2. Full app

### a. Firebase (sign-in)
1. [console.firebase.google.com](https://console.firebase.google.com) → Add project.
2. **Authentication → Sign-in method**: enable **Google** and **Anonymous**.
3. **Project settings → Your apps → Web app**: copy `apiKey`, `authDomain`, `projectId`, `appId`.
4. After step c, add your Vercel domain under **Authentication → Settings → Authorized domains**.

### b. API on Render (about $7/month for the disk-backed instance)
1. [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint** → pick `edenmhuang/benny`. It reads `render.yaml`.
2. Fill the variables (see `api/.env.example`):
   - `FIREBASE_PROJECT_ID`: from step a
   - `ALLOWED_ORIGINS`: your Vercel URL from step c (you can update it after)
   - `TOKEN_ENCRYPTION_KEY`: run `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`
   - `GEMINI_API_KEY`: from [aistudio.google.com](https://aistudio.google.com/apikey) (receipt reading)
   - `PLAID_*`: optional, from the [Plaid dashboard](https://dashboard.plaid.com); leave empty to turn bank linking off
3. Check `https://<your-api>.onrender.com/healthz` returns OK.

Railway or Fly.io also work with `api/Dockerfile`; mount a volume at `/data`.

### c. Web on Vercel
1. Import the repo again as a second project (for example `benny-app`).
2. Add environment variables:
   - `VITE_API_URL` = `https://<your-api>.onrender.com`
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`
3. Deploy, then finish step a.4 and set `ALLOWED_ORIGINS` on Render to this URL.

## Security notes
- Every API request is checked against a verified Firebase sign-in token; records are scoped to that user.
- Plaid access tokens are encrypted at rest with `TOKEN_ENCRYPTION_KEY`. Keep it secret and stable: changing it disconnects linked banks.
- Never set `DEV_TRUST_UID_HEADER` in production.
- Plaid production access requires Plaid's approval of your app.
