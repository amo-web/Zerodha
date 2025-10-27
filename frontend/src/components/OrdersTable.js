import React, { useState } from 'react';
import axios from 'axios';

function OrdersTable({ orders, onRefresh, formatCurrency }) {
  const [cancelling, setCancelling] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleCancelOrder = async (orderId) => {
    setCancelling(orderId);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/cancel-order', { order_id: orderId });
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Order cancelled successfully!' });
        setTimeout(() => {
          onRefresh();
          setMessage({ type: '', text: '' });
        }, 1000);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to cancel order'
      });
    } finally {
      setCancelling(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'COMPLETE': 'success',
      'REJECTED': 'danger',
      'CANCELLED': 'danger',
      'OPEN': 'info',
      'TRIGGER PENDING': 'warning',
      'MODIFY PENDING': 'warning',
      'AMO REQ RECEIVED': 'info'
    };
    return statusMap[status] || 'info';
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="trading-section">
        <div className="section-header">
          <h2>📋 Orders</h2>
        </div>
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No orders found. Place your first order to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="trading-section">
      <div className="section-header">
        <h2>📋 Orders</h2>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? 'success-message' : 'error-message'} style={{ marginBottom: '15px' }}>
          {message.text}
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Status</th>
              <th>Order Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              const canCancel = order.status === 'OPEN' || order.status === 'TRIGGER PENDING';
              
              return (
                <tr key={index}>
                  <td>
                    <small>{new Date(order.order_timestamp).toLocaleTimeString()}</small>
                  </td>
                  <td>
                    <strong>{order.tradingsymbol}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{order.exchange}</small>
                  </td>
                  <td>
                    <span className={`badge ${order.transaction_type === 'BUY' ? 'success' : 'danger'}`}>
                      {order.transaction_type}
                    </span>
                  </td>
                  <td>
                    {order.filled_quantity}/{order.quantity}
                  </td>
                  <td>
                    {order.order_type === 'MARKET' ? (
                      <span>MARKET</span>
                    ) : (
                      formatCurrency(order.price)
                    )}
                    <br />
                    <small style={{ color: '#666' }}>Avg: {order.average_price ? formatCurrency(order.average_price) : '-'}</small>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className="badge info">{order.product}</span>
                  </td>
                  <td>
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.order_id)}
                        disabled={cancelling === order.order_id}
                        style={{
                          padding: '6px 12px',
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: cancelling === order.order_id ? 'not-allowed' : 'pointer',
                          opacity: cancelling === order.order_id ? 0.6 : 1
                        }}
                      >
                        {cancelling === order.order_id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Total Orders</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              {orders.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Completed</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#27ae60' }}>
              {orders.filter(o => o.status === 'COMPLETE').length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Pending</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#f39c12' }}>
              {orders.filter(o => o.status === 'OPEN' || o.status.includes('PENDING')).length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Rejected</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#e74c3c' }}>
              {orders.filter(o => o.status === 'REJECTED' || o.status === 'CANCELLED').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersTable;
