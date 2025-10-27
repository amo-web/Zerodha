from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional, Dict, Any

from loguru import logger
from kiteconnect import KiteConnect

from .storage import Session, save_session


@dataclass
class KiteSessionState:
    api_key: str
    api_secret: Optional[str] = None
    access_token: Optional[str] = None
    public_token: Optional[str] = None
    user_id: Optional[str] = None


class ZerodhaClient:
    def __init__(self, api_key: str, access_token: Optional[str] = None) -> None:
        self.api_key = api_key
        self.kite = KiteConnect(api_key=api_key)
        if access_token:
            self.kite.set_access_token(access_token)
        logger.debug("ZerodhaClient initialized")

    def login_url(self) -> str:
        return self.kite.login_url()

    def generate_session(self, request_token: str, api_secret: str) -> KiteSessionState:
        logger.info("Exchanging request_token for access_token")
        data: Dict[str, Any] = self.kite.generate_session(request_token, api_secret=api_secret)
        access_token: str = data["access_token"]
        public_token: Optional[str] = data.get("public_token")
        user_id: Optional[str] = data.get("user_id")
        self.kite.set_access_token(access_token)
        sess = KiteSessionState(
            api_key=self.api_key,
            api_secret=api_secret,
            access_token=access_token,
            public_token=public_token,
            user_id=user_id,
        )
        # Persist minimal required session
        save_session(Session(api_key=self.api_key, access_token=access_token, public_token=public_token, user_id=user_id))
        return sess

    def get_margins(self) -> Dict[str, Any]:
        logger.debug("Fetching margins")
        return self.kite.margins()

    def place_market_order(self, tradingsymbol: str, quantity: int, transaction_type: str, exchange: str = "NSE", product: str = "CNC", variety: str = "regular", order_type: str = "MARKET",) -> Dict[str, Any]:
        logger.info("Placing order: {} {} {}", transaction_type, quantity, tradingsymbol)
        return self.kite.place_order(
            variety=variety,
            exchange=exchange,
            tradingsymbol=tradingsymbol,
            transaction_type=transaction_type,
            quantity=quantity,
            product=product,
            order_type=order_type,
        )

    def quote(self, instruments: list[str]) -> Dict[str, Any]:
        return self.kite.quote(instruments)
