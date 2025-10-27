from __future__ import annotations

import os
from typing import Optional

import streamlit as st
from loguru import logger

from .storage import load_session, save_session, clear_session, Session
from .zerodha_client import ZerodhaClient
from .instruments import search_symbols

st.set_page_config(page_title="Zerodha Auto Trader", page_icon="💹", layout="wide")

# Custom CSS for a modern look
CUSTOM_CSS = """
<style>
/***** Glassmorphism cards *****/
.block-container { padding-top: 1.5rem; }
section.main > div { max-width: 1280px; }

div[data-testid="stSidebar"] > div { background: #0b0f14; }

.card {
  background: rgba(19,26,34,0.6);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

.metric { display: flex; align-items: center; gap: 8px; }
.badge { padding: 2px 8px; border-radius: 999px; font-size: 12px; background: #1b2632; }

button[kind="primary"], .stButton > button { border-radius: 12px !important; font-weight: 600; }
input, textarea, select { border-radius: 12px !important; }

/* Hide the footer and menu */
#MainMenu { visibility: hidden; }
footer { visibility: hidden; }
</style>
"""

st.markdown(CUSTOM_CSS, unsafe_allow_html=True)


def get_client_from_session() -> Optional[ZerodhaClient]:
    session = load_session()
    if not session:
        return None
    client = ZerodhaClient(api_key=session.api_key, access_token=session.access_token)
    return client


def render_login_card():
    with st.container():
        st.markdown("### Connect Zerodha")
        st.caption("Provide your API credentials to initiate login.")
        api_key = st.text_input("API Key", type="default", placeholder="kiteapikey...")
        api_secret = st.text_input("API Secret", type="password", placeholder="••••••••••")
        col1, col2 = st.columns([1,1])
        login_url = None
        if st.button("Generate Login URL", type="primary", use_container_width=True):
            if not api_key or not api_secret:
                st.error("Please enter both API key and secret")
            else:
                client = ZerodhaClient(api_key=api_key)
                login_url = client.login_url()
                st.session_state["_api_key"] = api_key
                st.session_state["_api_secret"] = api_secret
                st.session_state["_login_url"] = login_url
                st.success("Login URL generated. Open it to authenticate.")
        if st.session_state.get("_login_url"):
            st.link_button("Open Zerodha Login", st.session_state["_login_url"], use_container_width=True)
            st.caption("After successful login, you'll be redirected to your REDIRECT_URL with a request_token query param. Paste it below.")
            request_token = st.text_input("Paste request_token from redirected URL")
            if st.button("Exchange Token & Save Session", type="primary", use_container_width=True):
                if not request_token:
                    st.error("Please paste the request_token")
                else:
                    api_key = st.session_state.get("_api_key")
                    api_secret = st.session_state.get("_api_secret")
                    client = ZerodhaClient(api_key=api_key)
                    try:
                        sess = client.generate_session(request_token=request_token, api_secret=api_secret)
                        save_session(Session(api_key=api_key, access_token=sess.access_token, public_token=sess.public_token, user_id=sess.user_id))
                        st.success("Logged in and session saved.")
                        st.experimental_rerun()
                    except Exception as exc:
                        logger.exception("Login exchange failed: {}", exc)
                        st.error(f"Login failed: {exc}")


def render_funds_card(client: ZerodhaClient):
    with st.container():
        st.markdown("### Account Overview")
        try:
            margins = client.get_margins()
            equity = margins.get("equity", {})
            available = equity.get("available", {})
            used = equity.get("utilised", {}) or equity.get("used", {})
            col1, col2, col3 = st.columns(3)
            col1.metric("Available Cash", f"₹ {available.get('cash', 0):,.2f}")
            col2.metric("Opening Balance", f"₹ {equity.get('net', 0):,.2f}")
            col3.metric("SPAN + Exposure Used", f"₹ {(used.get('span',0)+used.get('exposure',0)):,.2f}")
        except Exception as exc:
            logger.exception("Failed to fetch margins: {}", exc)
            st.error(f"Failed to fetch funds: {exc}")


def render_trade_card(client: ZerodhaClient):
    with st.container():
        st.markdown("### Quick Trade")
        st.caption("Search for a symbol and place a quick market order.")
        query = st.text_input("Search symbol (e.g. RELIANCE, INFY)")
        results = []
        if query:
            try:
                results = search_symbols(client.kite, query)
            except Exception as exc:
                logger.exception("Symbol search failed: {}", exc)
                st.warning("Instrument search failed; try again later.")
        if results:
            options = {f"{it.tradingsymbol} ({it.exchange})": it for it in results}
            choice_label = st.selectbox("Select instrument", list(options.keys()))
            chosen = options[choice_label]
            col_a, col_b, col_c = st.columns([1,1,1])
            side = col_a.selectbox("Side", ["BUY", "SELL"], index=0)
            qty = col_b.number_input("Quantity", min_value=1, value=1, step=1)
            exchange = col_c.selectbox("Exchange", ["NSE", "BSE"], index=0)
            product = st.selectbox("Product", ["CNC", "MIS", "NRML"], index=0)
            if st.button("Place Market Order", type="primary", use_container_width=True):
                try:
                    resp = client.place_market_order(
                        tradingsymbol=chosen.tradingsymbol,
                        quantity=int(qty),
                        transaction_type=side,
                        exchange=exchange,
                        product=product,
                    )
                    st.success(f"Order placed. ID: {resp.get('order_id')}")
                except Exception as exc:
                    logger.exception("Order failed: {}", exc)
                    st.error(f"Order failed: {exc}")
        else:
            st.info("Type at least 2 characters to search.")


def render_header(client: Optional[ZerodhaClient]):
    with st.sidebar:
        st.markdown("## 💹 Zerodha Auto Trader")
        if client:
            st.success("Connected")
            if st.button("Logout", use_container_width=True):
                clear_session()
                st.experimental_rerun()
        else:
            st.info("Not connected")
        st.divider()
        st.caption("Made with ❤️ using Streamlit")


def main():
    client = get_client_from_session()
    render_header(client)
    st.title("Zerodha Auto Trader")
    if not client:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        render_login_card()
        st.markdown('</div>', unsafe_allow_html=True)
        return

    col_left, col_right = st.columns([2, 3])
    with col_left:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        render_funds_card(client)
        st.markdown('</div>', unsafe_allow_html=True)
    with col_right:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        render_trade_card(client)
        st.markdown('</div>', unsafe_allow_html=True)


if __name__ == "__main__":
    main()
