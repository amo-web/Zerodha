from __future__ import annotations

from typing import Optional

from nicegui import ui, app as ng_app
from fastapi import Request
from fastapi.responses import RedirectResponse

from .config import settings
from .kite_service import kite_service
from .auto_trade import auto_trader, Rule


class AppState:
    login_url: Optional[str] = None


state = AppState()

@ng_app.get('/kite/callback')
async def kite_callback_page(request: Request):
    request_token = request.query_params.get('request_token') if request and request.query_params else None
    if not request_token:
        return RedirectResponse(url='/?error=missing_request_token')
    try:
        kite_service.generate_session(request_token)
        return RedirectResponse(url='/')
    except Exception:
        return RedirectResponse(url='/?error=auth_failed')

def header_bar() -> None:
    with ui.header().classes('items-center justify-between bg-gradient-to-r from-slate-900 to-slate-700 text-white'):
        ui.label('Zerodha Auto Trader').classes('text-2xl font-semibold')
        with ui.row().classes('items-center gap-4'):
            ui.link('Docs', 'https://kite.trade/docs/connect/v3/user/#login-flow', new_tab=True).classes('text-white/80 hover:text-white')


def onboarding() -> None:
    with ui.card().classes('max-w-xl w-full shadow-2xl p-6 bg-white/90'):
        ui.label('Connect your Zerodha account').classes('text-xl font-semibold mb-2')
        ui.label('Enter your API key and secret to generate a login link.').classes('text-gray-600')
        api_key = ui.input('API Key', value=settings.kite_api_key or '').classes('w-full')
        api_secret = ui.input('API Secret', password=True, password_toggle_button=True).classes('w-full')
        user_id = ui.input('User ID (optional)', value=settings.zerodha_user_id or '').classes('w-full')
        status = ui.label().classes('text-sm text-gray-500')
        
        def do_login():
            try:
                login_url = kite_service.set_api_credentials(api_key.value.strip(), api_secret.value.strip())
                state.login_url = login_url
                status.text = 'Login link generated. Opening a new tab...'
                ui.run_javascript(f'window.open("{login_url}", "_blank")')
            except Exception as e:
                ui.notify(f'Error: {e}', color='negative')
        
        ui.button('Generate login link', on_click=do_login).classes('w-full bg-slate-900 text-white hover:bg-slate-800')

        with ui.expansion('Have a request_token? Paste it here').classes('mt-4'):
            req = ui.input('request_token').classes('w-full')
            def submit_req():
                try:
                    tokens = kite_service.generate_session(req.value.strip())
                    ui.notify('Authenticated!', color='positive')
                    ui.navigate.to('/')
                except Exception as e:
                    ui.notify(f'Auth failed: {e}', color='negative')
            ui.button('Submit', on_click=submit_req).classes('w-full')


def dashboard() -> None:
    with ui.grid(columns=2).classes('gap-6 w-full'):
        with ui.card().classes('shadow-xl p-4 bg-white/95 backdrop-blur'):
            ui.label('Account Balance').classes('text-lg font-semibold')
            balance = ui.label('—').classes('text-3xl mt-2')
            def refresh_balance():
                try:
                    m = kite_service.get_balance()
                    available = m.get('available', {})
                    live = available.get('live_balance', m.get('net', '—'))
                    balance.text = f'₹ {live}'
                except Exception as e:
                    balance.text = '—'
                    ui.notify(f'Error fetching balance: {e}', color='negative')
            ui.button('Refresh', on_click=refresh_balance)

        with ui.card().classes('shadow-xl p-4 bg-white/95'):
            ui.label('Place Market Order').classes('text-lg font-semibold')
            symbol = ui.input('Trading Symbol (e.g., TCS)').classes('w-full')
            exchange = ui.select(['NSE', 'BSE'], value='NSE', label='Exchange').classes('w-full')
            side = ui.select(['BUY', 'SELL'], value='BUY', label='Side').classes('w-full')
            qty = ui.number('Quantity', value=1, min=1, step=1).classes('w-full')

            def place():
                try:
                    res = kite_service.place_market_order(tradingsymbol=symbol.value.strip(), exchange=exchange.value, txn_type=side.value, quantity=int(qty.value))
                    ui.notify(f"Order placed: {res['order_id']}", color='positive')
                except Exception as e:
                    ui.notify(f'Order failed: {e}', color='negative')
            ui.button('Submit Order', on_click=place).classes('w-full bg-emerald-600 text-white hover:bg-emerald-500')

    with ui.card().classes('shadow-xl p-4 bg-white/95 mt-6'):
        ui.label('Auto-Trade (demo skeleton)').classes('text-lg font-semibold')
        sym = ui.input('Trading Symbol', value='TCS').classes('w-full')
        side2 = ui.select(['BUY', 'SELL'], value='BUY', label='Side').classes('w-full')
        qty2 = ui.number('Quantity', value=1, min=1, step=1).classes('w-full')
        interval = ui.number('Check interval (sec)', value=10, min=5, step=5).classes('w-full')

        def start_auto():
            rule = Rule(enabled=True, tradingsymbol=sym.value.strip(), side=side2.value, quantity=int(qty2.value), check_interval_sec=int(interval.value))
            ui.run_worker(auto_trader.start(rule))
            ui.notify('Auto-trader started', color='positive')

        def stop_auto():
            ui.run_worker(auto_trader.stop())
            ui.notify('Auto-trader stopped', color='warning')

        with ui.row().classes('gap-4'):
            ui.button('Start', on_click=start_auto).classes('bg-indigo-600 text-white')
            ui.button('Stop', on_click=stop_auto).classes('bg-gray-200')


def build_routes() -> None:
    header_bar()
    with ui.column().classes('min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6'):
        if not kite_service.is_authenticated():
            onboarding()
        else:
            dashboard()


def create_app() -> None:
    ui.colors(primary='#0f172a')
    ui.page_title('Zerodha Auto Trader')
    build_routes()


__all__ = ['create_app']
