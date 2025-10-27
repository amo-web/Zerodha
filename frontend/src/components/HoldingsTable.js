import React from 'react';

function HoldingsTable({ holdings, formatCurrency }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="trading-section">
        <div className="section-header">
          <h2>📊 Holdings</h2>
        </div>
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No holdings found. Start trading to see your holdings here.
        </p>
      </div>
    );
  }

  return (
    <div className="trading-section">
      <div className="section-header">
        <h2>📊 Holdings</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Avg. Price</th>
              <th>LTP</th>
              <th>Current Value</th>
              <th>P&L</th>
              <th>Day Change %</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => {
              const currentValue = holding.last_price * holding.quantity;
              const investedValue = holding.average_price * holding.quantity;
              const pnl = currentValue - investedValue;
              const pnlPercent = ((pnl / investedValue) * 100).toFixed(2);
              const dayChange = holding.day_change_percentage || 0;

              return (
                <tr key={index}>
                  <td>
                    <strong>{holding.tradingsymbol}</strong>
                    <br />
                    <small style={{ color: '#666' }}>{holding.exchange}</small>
                  </td>
                  <td>{holding.quantity}</td>
                  <td>{formatCurrency(holding.average_price)}</td>
                  <td>{formatCurrency(holding.last_price)}</td>
                  <td>{formatCurrency(currentValue)}</td>
                  <td className={pnl >= 0 ? 'positive' : 'negative'}>
                    {formatCurrency(pnl)}
                    <br />
                    <small>({pnlPercent}%)</small>
                  </td>
                  <td className={dayChange >= 0 ? 'positive' : 'negative'}>
                    {dayChange.toFixed(2)}%
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
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Total Investment</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              {formatCurrency(holdings.reduce((sum, h) => sum + (h.average_price * h.quantity), 0))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Current Value</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
              {formatCurrency(holdings.reduce((sum, h) => sum + (h.last_price * h.quantity), 0))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>Total P&L</div>
            <div style={{ fontSize: '18px', fontWeight: '600' }} className={holdings.reduce((sum, h) => sum + (h.pnl || 0), 0) >= 0 ? 'positive' : 'negative'}>
              {formatCurrency(holdings.reduce((sum, h) => sum + (h.pnl || 0), 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HoldingsTable;
