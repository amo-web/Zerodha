from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import os

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / ".data"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

load_dotenv(BASE_DIR / ".env", override=False)


@dataclass(frozen=True)
class Settings:
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8080"))
    kite_api_key: str | None = os.getenv("KITE_API_KEY")
    kite_api_secret: str | None = os.getenv("KITE_API_SECRET")
    zerodha_user_id: str | None = os.getenv("Z_USER_ID")


settings = Settings()
