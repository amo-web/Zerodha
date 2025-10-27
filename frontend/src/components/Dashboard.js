import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TradingPanel from './TradingPanel';
import HoldingsTable from './HoldingsTable';
import PositionsTable from './PositionsTable';
import OrdersTable from './OrdersTable';

function Dashboard({ user, onLogout }) {
  const [balance, setBalance] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState({ net: [], day: [] });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, holdingsRes, positionsRes, ordersRes] = await Promise.all([
        axios.get('/api/balance'),
        axios.get('/api/holdings'),
        axios.get('/api/positions'),
        axios.get('/api/orders')
      ]);

      if (balanceRes.data.success) {
        setBalance(balanceRes.data.margins);
      }
      if (holdingsRes.data.success) {
        setHoldings(holdingsRes.data.holdings);
      }
      if (positionsRes.data.success) {
        setPositions(positionsRes.data.positions);
      }
      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to fetch data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const equity = balance?.equity || {};
  const availableBalance = equity.available?.cash || 0;
  const usedMargin = equity.utilised?.debits || 0;
  const totalBalance = availableBalance + usedMargin;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Trading Dashboard</h1>
          <p>Welcome back, {user?.user_name || 'Trader'} ({user?.email || ''})</p>
        </div>
        <div className="header-right">
          <button className="btn-secondary" onClick={fetchData}>
            🔄 Refresh
          </button>
          <button className="btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <div className="card">
          <div className="card-header">
            <div className="card-icon blue">💰</div>
            <h3 className="card-title">Available Balance</h3>
          </div>
          <div className="card-value">{formatCurrency(availableBalance)}</div>
          <div className="card-details">
            <div className="detail-row">
              <span className="detail-label">Total Balance</span>
              <span className="detail-value">{formatCurrency(totalBalance)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Used Margin</span>
              <span className="detail-value">{formatCurrency(usedMargin)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon green">📊</div>
            <h3 className="card-title">Holdings</h3>
          </div>
          <div className="card-value">{holdings.length}</div>
          <div className="card-details">
            <div className="detail-row">
              <span className="detail-label">Total Value</span>
              <span className="detail-value">
                {formatCurrency(holdings.reduce((sum, h) => sum + (h.last_price * h.quantity), 0))}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">P&L</span>
              <span className={`detail-value ${holdings.reduce((sum, h) => sum + (h.pnl || 0), 0) >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(holdings.reduce((sum, h) => sum + (h.pnl || 0), 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon orange">📈</div>
            <h3 className="card-title">Today's Positions</h3>
          </div>
          <div className="card-value">{positions.net?.length || 0}</div>
          <div className="card-details">
            <div className="detail-row">
              <span className="detail-label">Day P&L</span>
              <span className={`detail-value ${positions.net?.reduce((sum, p) => sum + (p.pnl || 0), 0) >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(positions.net?.reduce((sum, p) => sum + (p.pnl || 0), 0) || 0)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Orders</span>
              <span className="detail-value">{orders.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <div className="tab-buttons" style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          background: 'white',
          padding: '10px',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <button 
            className={`btn-secondary ${activeTab === 'trading' ? 'active' : ''}`}
            onClick={() => setActiveTab('trading')}
            style={activeTab === 'trading' ? { background: '#667eea', color: 'white' } : {}}
          >
            Trading
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'holdings' ? 'active' : ''}`}
            onClick={() => setActiveTab('holdings')}
            style={activeTab === 'holdings' ? { background: '#667eea', color: 'white' } : {}}
          >
            Holdings
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'positions' ? 'active' : ''}`}
            onClick={() => setActiveTab('positions')}
            style={activeTab === 'positions' ? { background: '#667eea', color: 'white' } : {}}
          >
            Positions
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            style={activeTab === 'orders' ? { background: '#667eea', color: 'white' } : {}}
          >
            Orders
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'trading' && <TradingPanel onOrderPlaced={fetchData} />}
          {activeTab === 'holdings' && <HoldingsTable holdings={holdings} formatCurrency={formatCurrency} />}
          {activeTab === 'positions' && <PositionsTable positions={positions} formatCurrency={formatCurrency} />}
          {activeTab === 'orders' && <OrdersTable orders={orders} onRefresh={fetchData} formatCurrency={formatCurrency} />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
