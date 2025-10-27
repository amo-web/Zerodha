import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const PositionsTable = ({ positions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  if (!positions || positions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card glass-dark text-white"
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white text-opacity-50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Open Positions</h3>
          <p className="text-white text-opacity-70">
            You don't have any open positions currently.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card glass-dark text-white"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Open Positions</h3>
        <div className="text-sm text-white text-opacity-70">
          {positions.length} {positions.length === 1 ? 'position' : 'positions'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white border-opacity-20">
              <th className="text-left py-3 px-4 font-semibold">Symbol</th>
              <th className="text-center py-3 px-4 font-semibold">Side</th>
              <th className="text-right py-3 px-4 font-semibold">Quantity</th>
              <th className="text-right py-3 px-4 font-semibold">Avg Price</th>
              <th className="text-right py-3 px-4 font-semibold">LTP</th>
              <th className="text-right py-3 px-4 font-semibold">P&L</th>
              <th className="text-right py-3 px-4 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => {
              const pnl = position.pnl || 0;
              const pnlPercent = position.pnl_percentage || 0;
              const currentValue = position.average_price * position.quantity;
              
              return (
                <motion.tr
                  key={`${position.tradingsymbol}-${position.transaction_type}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-semibold">{position.tradingsymbol}</div>
                      <div className="text-sm text-white text-opacity-70">
                        {position.instrument_token}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      position.transaction_type === 'BUY' 
                        ? 'bg-green-500 bg-opacity-20 text-green-400'
                        : 'bg-red-500 bg-opacity-20 text-red-400'
                    }`}>
                      {position.transaction_type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {formatNumber(position.quantity)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {formatCurrency(position.average_price)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {formatCurrency(position.last_price)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {getChangeIcon(pnl)}
                      <span className={getChangeColor(pnl)}>
                        {formatCurrency(pnl)}
                      </span>
                    </div>
                    <div className={`text-sm ${getChangeColor(pnl)}`}>
                      {pnlPercent > 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold">
                    {formatCurrency(currentValue)}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PositionsTable;