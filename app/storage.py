from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from loguru import logger

DATA_DIR = Path(os.getenv("BOT_DATA_DIR", "/workspace/data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)

SESSION_FILE = DATA_DIR / "session.json"
INSTRUMENTS_FILE = DATA_DIR / "instruments.csv"


@dataclass
class Session:
    api_key: str
    access_token: str
    public_token: Optional[str] = None
    user_id: Optional[str] = None


def save_session(session: Session) -> None:
    try:
        payload = {
            "api_key": session.api_key,
            "access_token": session.access_token,
            "public_token": session.public_token,
            "user_id": session.user_id,
        }
        SESSION_FILE.write_text(json.dumps(payload, indent=2))
        os.chmod(SESSION_FILE, 0o600)
        logger.info("Session saved to {}", SESSION_FILE)
    except Exception as exc:
        logger.exception("Failed to save session: {}", exc)


def load_session() -> Optional[Session]:
    try:
        if not SESSION_FILE.exists():
            return None
        data = json.loads(SESSION_FILE.read_text())
        return Session(
            api_key=data.get("api_key", ""),
            access_token=data.get("access_token", ""),
            public_token=data.get("public_token"),
            user_id=data.get("user_id"),
        )
    except Exception as exc:
        logger.exception("Failed to load session: {}", exc)
        return None


def clear_session() -> None:
    try:
        if SESSION_FILE.exists():
            SESSION_FILE.unlink()
            logger.info("Session cleared")
    except Exception as exc:
        logger.exception("Failed to clear session: {}", exc)


__all__ = [
    "Session",
    "save_session",
    "load_session",
    "clear_session",
    "INSTRUMENTS_FILE",
]
