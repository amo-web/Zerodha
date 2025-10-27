from __future__ import annotations

from dataclasses import dataclass
from typing import Optional
import asyncio
import time

from .kite_service import kite_service


@dataclass
class Rule:
    enabled: bool
    tradingsymbol: str
    exchange: str = "NSE"
    side: str = "BUY"  # BUY or SELL
    quantity: int = 1
    check_interval_sec: int = 10


class AutoTrader:
    def __init__(self) -> None:
        self.rule: Optional[Rule] = None
        self._task: Optional[asyncio.Task] = None

    async def start(self, rule: Rule) -> None:
        self.rule = rule
        await self.stop()
        self._task = asyncio.create_task(self._run())

    async def stop(self) -> None:
        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        self._task = None

    async def _run(self) -> None:
        assert self.rule is not None
        rule = self.rule
        while True:
            await asyncio.sleep(rule.check_interval_sec)
            # Placeholder: simple heartbeat trade example (DO NOT USE IN PROD)
            try:
                if not kite_service.is_authenticated():
                    continue
                # Implement actual strategy here; for demo, no-op
                # Example: place dummy order if some condition met
                # kite_service.place_market_order(rule.tradingsymbol, rule.exchange, rule.side, rule.quantity)
            except Exception:
                # swallow and continue loop
                pass


auto_trader = AutoTrader()
