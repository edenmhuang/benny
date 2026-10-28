# Benny

Your cards owe you money. Benny reads your card policies, checks your purchases, and shows the credits, missed rewards and protections you're leaving behind, with the fine print behind every answer.

Built at Cal Hacks 13.0 on [Mana](https://mana.space). This repo is the standalone version.

| Folder | What it is |
|---|---|
| `web/` | React + Vite frontend (the Benny+ app) |
| `api/` | Python API: private per-user records in SQLite, receipt reading (Gemini), bank import (Plaid) |
| `api/bundle/` | Pinned card rules (21 cards, quotes verified against issuer pages) and the rewards engine |

## Two ways to run it

- **Demo**: build `web/` with no environment variables. Sample data, no sign-in, no backend, nothing leaves the browser.
- **Full app**: set the web variables (Firebase + `VITE_API_URL`) and run the API.

See **[DEPLOY.md](DEPLOY.md)** for step-by-step hosting.

## Local development

```bash
# API
cd api && python -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt
DEV_TRUST_UID_HEADER=1 PORT=8080 python server.py     # local only: trusts X-Sender-Uid instead of Firebase tokens

# Web (demo mode)
cd web && npm install && npm run dev
```

## What's different from the Mana version

- Sign-in uses Firebase Auth (Google or guest) instead of Mana accounts.
- Rules and engine ship as files in `api/bundle/` instead of being read from Mana.
- AI and Plaid keys are server environment variables.
- **Not included yet:** the Shop tab (needs a hosted browser) and Gmail import (needs Google's Gmail verification). Receipt upload, statements, CSV and Plaid all work.
