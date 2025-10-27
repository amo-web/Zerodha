# Zerodha Auto Trader (Streamlit)

A modern Streamlit-based UI for logging into Zerodha (Kite Connect), persisting the access token locally, showing funds, and placing quick market orders.

## Features
- Login flow: Enter API key/secret, open Kite login URL, paste `request_token`, exchange for `access_token`.
- Session persistence: Stores `access_token` securely in `data/session.json` (0600 permissions).
- Funds view: Displays margins and available cash.
- Quick trade: Search instruments and place market buy/sell orders.
- Instruments cache: Local CSV refreshed every 6 hours.
- Modern dark UI with glassmorphism.

## Setup

1. Python 3.10+
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the app:

```bash
streamlit run app/ui.py
```

4. Login flow:
- Provide your `API Key` and `API Secret`.
- Click "Generate Login URL" then authenticate on Zerodha.
- After you are redirected to your configured redirect URL, copy the `request_token` from the URL and paste it back in the app.
- Click "Exchange Token & Save Session".

## Notes
- This app stores session data locally in `data/session.json`. Keep your machine secure.
- Never commit your credentials to git.
- Trading in live markets carries risk. Use at your own discretion.
