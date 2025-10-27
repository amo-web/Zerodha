from __future__ import annotations

from dataclasses import dataclass
from typing import Optional
import time

from kiteconnect import KiteConnect

from .config import settings
from .storage import tokens_store, state_store


@dataclass
class SessionTokens:
    access_token: str
    public_token: str | None = None
    api_key: str | None = None
    created_at: float = time.time()


class KiteService:
    def __init__(self):
        self.api_key: Optional[str] = settings.kite_api_key
        self.api_secret: Optional[str] = settings.kite_api_secret
        self.kite: Optional[KiteConnect] = None
        self._load_saved_tokens()

    # ---------- persistence ----------
    def _load_saved_tokens(self) -> None:
        saved = tokens_store.read({})
        if not saved:
            return
        self.api_key = saved.get("api_key") or self.api_key
        access_token = saved.get("access_token")
        if self.api_key and access_token:
            self.kite = KiteConnect(api_key=self.api_key)
            self.kite.set_access_token(access_token)

    def _save_tokens(self, tokens: SessionTokens) -> None:
        tokens_store.write({
            "access_token": tokens.access_token,
            "public_token": tokens.public_token,
            "api_key": tokens.api_key or self.api_key,
            "created_at": tokens.created_at,
        })

    def clear_session(self) -> None:
        tokens_store.clear()
        state_store.clear()
        self.kite = None

    # ---------- auth flow ----------
    def set_api_credentials(self, api_key: str, api_secret: str) -> str:
        self.api_key = api_key
        self.api_secret = api_secret
        # Persist for convenience (no secret in repo)
        state_store.write({"api_key": api_key, "have_secret": bool(api_secret)})
        kite = KiteConnect(api_key=api_key)
        # Provide redirect_url to allow auto-callback into our app (optional)
        try:
            redirect_url = f"http://{settings.host}:{settings.port}/kite/callback"
            login_url = kite.login_url()+f"&redirect_params=*&redirect_url={redirect_url}"
        except Exception:
            login_url = kite.login_url()
        # Temporarily keep instance to verify
        self.kite = kite
        return login_url

    def generate_session(self, request_token: str) -> SessionTokens:
        if not self.api_key or not self.api_secret:
            raise ValueError("API key/secret not set")
        kite = self.kite or KiteConnect(api_key=self.api_key)
        data = kite.generate_session(request_token=request_token, api_secret=self.api_secret)
        access_token = data.get("access_token")
        public_token = data.get("public_token")
        if not access_token:
            raise RuntimeError("Failed to obtain access token")
        kite.set_access_token(access_token)
        self.kite = kite
        tokens = SessionTokens(access_token=access_token, public_token=public_token, api_key=self.api_key, created_at=time.time())
        self._save_tokens(tokens)
        return tokens

    def is_authenticated(self) -> bool:
        return self.kite is not None and bool(tokens_store.read().get("access_token"))

    # ---------- account ----------
    def get_balance(self) -> dict:
        if not self.kite:
            raise RuntimeError("Not authenticated")
        # funds() returns dict with available margins
        margins = self.kite.margins(segment="equity")
        # Example structure: { 'net': 12345, 'available': { 'live_balance': x, ... } }
        return margins

    # ---------- orders ----------
    def place_market_order(self, tradingsymbol: str, exchange: str = "NSE", txn_type: str = "BUY", quantity: int = 1, product: str = "CNC", variety: str = "regular") -> dict:
        if not self.kite:
            raise RuntimeError("Not authenticated")
        order_id = self.kite.place_order(
            exchange=exchange,
            tradingsymbol=tradingsymbol,
            transaction_type=txn_type,
            quantity=quantity,
            order_type=self.kite.ORDER_TYPE_MARKET,
            product=product,
            variety=variety,
        )
        return {"order_id": order_id}


kite_service = KiteService()
