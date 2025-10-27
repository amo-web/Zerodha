from __future__ import annotations

from nicegui import ui

from app.ui import create_app
from app.config import settings


def app_entry():
    create_app()

if __name__ in {"__main__", "__mp_main__"}:
    app_entry()
    ui.run(host=settings.host, port=settings.port, reload=False, uvicorn_logging_level='info')
