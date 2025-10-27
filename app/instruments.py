from __future__ import annotations

import io
import time
from dataclasses import dataclass
from typing import List

import pandas as pd
from loguru import logger

from .storage import INSTRUMENTS_FILE


CACHE_TTL_SECONDS = 60 * 60 * 6  # 6 hours


@dataclass
class Instrument:
    instrument_token: int
    exchange_token: int
    tradingsymbol: str
    name: str
    last_price: float | None
    exchange: str
    segment: str
    instrument_type: str


def is_cache_stale() -> bool:
    if not INSTRUMENTS_FILE.exists():
        return True
    age = time.time() - INSTRUMENTS_FILE.stat().st_mtime
    return age > CACHE_TTL_SECONDS


def refresh_instruments_csv(kite) -> None:
    logger.info("Refreshing instruments cache from API")
    instruments = kite.instruments()
    df = pd.DataFrame(instruments)
    # Keep only core columns to reduce size
    cols = [
        "instrument_token",
        "exchange_token",
        "tradingsymbol",
        "name",
        "last_price",
        "exchange",
        "segment",
        "instrument_type",
    ]
    df = df[cols]
    INSTRUMENTS_FILE.write_text(df.to_csv(index=False))


def load_instruments_df(kite) -> pd.DataFrame:
    if is_cache_stale():
        refresh_instruments_csv(kite)
    return pd.read_csv(INSTRUMENTS_FILE)


def search_symbols(kite, query: str, limit: int = 20) -> List[Instrument]:
    df = load_instruments_df(kite)
    q = query.strip().upper()
    if not q:
        return []
    mask = df["tradingsymbol"].str.contains(q, case=False, na=False) | df["name"].fillna("").str.contains(q, case=False, na=False)
    results = df[mask].copy().head(limit)
    items: List[Instrument] = []
    for _, row in results.iterrows():
        items.append(
            Instrument(
                instrument_token=int(row.instrument_token),
                exchange_token=int(row.exchange_token),
                tradingsymbol=row.tradingsymbol,
                name=str(row.name) if not pd.isna(row.name) else "",
                last_price=float(row.last_price) if not pd.isna(row.last_price) else None,
                exchange=row.exchange,
                segment=row.segment,
                instrument_type=row.instrument_type,
            )
        )
    return items
