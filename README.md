# Zerodha Auto Trader (NiceGUI + KiteConnect)

A modern Python app to login to Zerodha (KiteConnect), persist access token, show available balance, place market orders, and run a minimal auto-trade skeleton. Built with NiceGUI for a sleek web UI.

## Quickstart

1. Create and activate venv
```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Configure environment
```bash
cp .env.example .env
# edit .env and fill KITE_API_KEY and KITE_API_SECRET (or fill via UI)
```

4. Run the app
```bash
python main.py
# open http://localhost:8080
```

## Login Flow
- Enter API key and secret, click "Generate login link".
- Browser opens Zerodha login. After login, copy the `request_token` from the redirect URL and paste into the UI.
- Token is saved locally under `.data/.kite_tokens.json` until it expires; UI will reuse it.

## Notes
- This repository stores tokens only on your machine under `.data/`. Do not commit `.data`.
- Auto-trade block is a placeholder; implement your own logic before using on live funds.
