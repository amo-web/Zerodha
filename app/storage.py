from __future__ import annotations

from pathlib import Path
import json
from typing import Any

from .config import STORAGE_DIR


class JsonStore:
    def __init__(self, name: str):
        self.path: Path = STORAGE_DIR / f"{name}.json"

    def read(self, default: dict[str, Any] | None = None) -> dict[str, Any]:
        if not self.path.exists():
            return default or {}
        try:
            return json.loads(self.path.read_text())
        except Exception:
            return default or {}

    def write(self, data: dict[str, Any]) -> None:
        self.path.write_text(json.dumps(data, indent=2))

    def clear(self) -> None:
        if self.path.exists():
            self.path.unlink()


tokens_store = JsonStore(".kite_tokens")
state_store = JsonStore(".kite_state")
ui_store = JsonStore(".ui_state")
