import React from 'react';

function PositionsTable({ positions, formatCurrency }) {
  const netPositions = positions?.net || [];

  if (netPositions.length === 0) {
    return (
      <div className="trading-section">
        <div className="section-header">
          <h2>📈 Positions</h2>
        </div>
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No open positions. Place orders to see your positions here.
        </p>
      </div>
    );
  }

  return (
    <div className="trading-section">
      <div className="section-header">
        <h2>📈 Positions</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Avg. Price</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Day Change</th>
            </tr>
          </thead>
          <tbody>
            {netPositions.map((position, index) => {
              const pnl = position.pnl || 0;
              const dayPnl = position.day_pnl || 0;

              return (
                <tr key={index}>
                  <td>
                    <strong>{position.tradingsymbol}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{position.exchange}</small>
                  </td>
                  <td>
                    <span className="badge info">{position.product}</span>
                  </td>
                  <td>
                    {position.quantity > 0 ? (
                      <span className="positive">+{position.quantity}</span>
                    ) : (
                      <span className="negative">{position.quantity}</span>
                    )}
                  </td>
                  <td>{formatCurrency(position.average_price)}</td>
                  <td>{formatCurrency(position.last_price)}</td>
                  <td className={pnl >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(pnl)}
                  </td>
                  <td className={dayPnl >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(dayPnl)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Total P&L</div>
            <div style={{ fontSize: '18px', fontWeight: '600' }} className={netPositions.reduce((sum, p) => sum + (p.pnl || 0), 0) >= 0 ? 'positive' : 'negative'}>
              {formatCurrency(netPositions.reduce((sum, p) => sum + (p.pnl || 0), 0))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Day P&L</div>
            <div style={{ fontSize: '18px', fontWeight: '600' }} className={netPositions.reduce((sum, p) => sum + (p.day_pnl || 0), 0) >= 0 ? 'positive' : 'negative'}>
              {formatCurrency(netPositions.reduce((sum, p) => sum + (p.day_pnl || 0), 0))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Open Positions</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              {netPositions.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PositionsTable;
