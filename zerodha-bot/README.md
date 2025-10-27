# Zerodha Auto Trader (Next.js + Kite Connect)

A modern Next.js app to login to your Zerodha Kite account, persist the access token securely on the server (file-based), view available funds, and place simple market/limit orders.

## Features
- Store API key/secret server-side (file-based persistence)
- Login via Kite Connect (request_token exchange)
- Persisted access token until expiry
- Display funds (net/available/utilised)
- Place simple orders (BUY/SELL, MARKET/LIMIT)
- Modern Tailwind UI

## Prerequisites
- Node.js 18+
- A Kite Connect app with API Key and Secret
- Set your Kite app Redirect URL to `http://localhost:3000/callback` (for dev)

## Setup
1. Install dependencies (already done in this repo):
   ```bash
   cd zerodha-bot
   npm install
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000`.

## Usage
1. Enter your API Key and Secret in the Credentials card and click Save.
2. Click "Login to Kite". You'll be redirected to Kite to authorize the app.
3. On success, Kite redirects back to `/callback`, which auto-exchanges the `request_token` and stores the `access_token`.
4. You'll be redirected back to the dashboard with funds visible.
5. Place a simple order from the Place Order section.

## Security notes
- Secrets and tokens are stored in `data/kite-session.json` on the server. Avoid committing this file.
- Consider moving to an encrypted store (e.g., environment + KMS) for production.
- Always review Zerodha/Kite Connect rate limits and terms.

## Environment
No environment variables are required for this demo. Credentials are supplied at runtime.

## Folder structure
- `src/lib/storage.ts`: file-based persistence helpers
- `src/lib/kite.ts`: Kite Connect session helpers
- `src/app/api/*`: Next.js API routes
- `src/app/page.tsx`: UI (credentials, login, funds, order form)

## Production hardening ideas
- Use OAuth redirect end-to-end to auto-capture `request_token` on a callback page
- Encrypt secrets at rest
- Add session expiry handling and re-login prompt
- Implement orderbook/positions and logs

---
This project is intended for educational use. Use responsibly and test with paper trading where possible.
