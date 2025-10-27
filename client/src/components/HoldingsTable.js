import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const HoldingsTable = ({ holdings }) => {
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

  if (!holdings || holdings.length === 0) {
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
          <h3 className="text-lg font-semibold mb-2">No Holdings</h3>
          <p className="text-white text-opacity-70">
            You don't have any holdings in your portfolio yet.
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
        <h3 className="text-xl font-bold">Holdings</h3>
        <div className="text-sm text-white text-opacity-70">
          {holdings.length} {holdings.length === 1 ? 'holding' : 'holdings'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white border-opacity-20">
              <th className="text-left py-3 px-4 font-semibold">Symbol</th>
              <th className="text-right py-3 px-4 font-semibold">Quantity</th>
              <th className="text-right py-3 px-4 font-semibold">Avg Price</th>
              <th className="text-right py-3 px-4 font-semibold">LTP</th>
              <th className="text-right py-3 px-4 font-semibold">P&L</th>
              <th className="text-right py-3 px-4 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => {
              const pnl = holding.pnl || 0;
              const pnlPercent = holding.pnl_percentage || 0;
              const currentValue = holding.average_price * holding.quantity;
              
              return (
                <motion.tr
                  key={holding.tradingsymbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-semibold">{holding.tradingsymbol}</div>
                      <div className="text-sm text-white text-opacity-70">
                        {holding.instrument_token}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {formatNumber(holding.quantity)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {formatCurrency(holding.average_price)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {formatCurrency(holding.last_price)}
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

export default HoldingsTable;