import React, { useState } from 'react';
import axios from 'axios';

function TradingPanel({ onOrderPlaced }) {
  const [formData, setFormData] = useState({
    tradingsymbol: '',
    exchange: 'NSE',
    transaction_type: 'BUY',
    quantity: '',
    order_type: 'MARKET',
    product: 'CNC',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, transactionType) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const orderData = {
        ...formData,
        transaction_type: transactionType
      };

      const response = await axios.post('/api/place-order', orderData);

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: `Order placed successfully! Order ID: ${response.data.order_id}`
        });
        
        // Reset form
        setFormData({
          tradingsymbol: '',
          exchange: 'NSE',
          transaction_type: 'BUY',
          quantity: '',
          order_type: 'MARKET',
          product: 'CNC',
          price: ''
        });

        // Refresh parent data
        if (onOrderPlaced) {
          setTimeout(() => onOrderPlaced(), 1000);
        }
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to place order'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trading-section">
      <div className="section-header">
        <h2>📊 Place Order</h2>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
          {message.text}
        </div>
      )}

      <form>
        <div className="trading-form">
          <div className="form-group-inline">
            <label htmlFor="tradingsymbol">Trading Symbol *</label>
            <input
              type="text"
              id="tradingsymbol"
              name="tradingsymbol"
              value={formData.tradingsymbol}
              onChange={handleChange}
              placeholder="e.g., INFY, RELIANCE"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group-inline">
            <label htmlFor="exchange">Exchange</label>
            <select
              id="exchange"
              name="exchange"
              value={formData.exchange}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
              <option value="NFO">NFO</option>
              <option value="CDS">CDS</option>
              <option value="BFO">BFO</option>
              <option value="MCX">MCX</option>
            </select>
          </div>

          <div className="form-group-inline">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="1"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group-inline">
            <label htmlFor="order_type">Order Type</label>
            <select
              id="order_type"
              name="order_type"
              value={formData.order_type}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="MARKET">MARKET</option>
              <option value="LIMIT">LIMIT</option>
            </select>
          </div>

          {formData.order_type === 'LIMIT' && (
            <div className="form-group-inline">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter limit price"
                step="0.01"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group-inline">
            <label htmlFor="product">Product Type</label>
            <select
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="CNC">CNC (Delivery)</option>
              <option value="MIS">MIS (Intraday)</option>
              <option value="NRML">NRML (F&O)</option>
            </select>
          </div>
        </div>

        <div className="btn-group">
          <button
            type="button"
            className="btn-success"
            onClick={(e) => handleSubmit(e, 'BUY')}
            disabled={loading || !formData.tradingsymbol || !formData.quantity}
          >
            {loading ? '⏳ Placing...' : '📈 BUY'}
          </button>
          <button
            type="button"
            className="btn-sell"
            onClick={(e) => handleSubmit(e, 'SELL')}
            disabled={loading || !formData.tradingsymbol || !formData.quantity}
          >
            {loading ? '⏳ Placing...' : '📉 SELL'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px', fontSize: '13px', color: '#666' }}>
        <strong>Tips:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          <li>Use correct trading symbols (e.g., INFY for Infosys, RELIANCE for Reliance)</li>
          <li>MARKET orders execute immediately at current market price</li>
          <li>LIMIT orders execute only at your specified price or better</li>
          <li>CNC for delivery, MIS for intraday, NRML for F&O trading</li>
        </ul>
      </div>
    </div>
  );
}

export default TradingPanel;
