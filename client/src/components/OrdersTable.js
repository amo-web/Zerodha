import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const OrdersTable = ({ orders }) => {
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

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'open':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return 'text-green-500 bg-green-500 bg-opacity-20';
      case 'open':
        return 'text-yellow-500 bg-yellow-500 bg-opacity-20';
      case 'cancelled':
        return 'text-red-500 bg-red-500 bg-opacity-20';
      default:
        return 'text-gray-500 bg-gray-500 bg-opacity-20';
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card glass-dark text-white"
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white text-opacity-50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Orders</h3>
          <p className="text-white text-opacity-70">
            You haven't placed any orders yet.
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
        <h3 className="text-xl font-bold">Recent Orders</h3>
        <div className="text-sm text-white text-opacity-70">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white border-opacity-20">
              <th className="text-left py-3 px-4 font-semibold">Symbol</th>
              <th className="text-center py-3 px-4 font-semibold">Type</th>
              <th className="text-center py-3 px-4 font-semibold">Side</th>
              <th className="text-right py-3 px-4 font-semibold">Quantity</th>
              <th className="text-right py-3 px-4 font-semibold">Price</th>
              <th className="text-center py-3 px-4 font-semibold">Status</th>
              <th className="text-right py-3 px-4 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((order, index) => (
              <motion.tr
                key={order.order_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-semibold">{order.tradingsymbol}</div>
                    <div className="text-sm text-white text-opacity-70">
                      {order.instrument_token}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-white bg-opacity-10">
                    {order.product}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.transaction_type === 'BUY' 
                      ? 'bg-green-500 bg-opacity-20 text-green-400'
                      : 'bg-red-500 bg-opacity-20 text-red-400'
                  }`}>
                    {order.transaction_type}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  {formatNumber(order.quantity)}
                </td>
                <td className="py-4 px-4 text-right">
                  {formatCurrency(order.price)}
                </td>
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-sm text-white text-opacity-70">
                  {new Date(order.order_timestamp).toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OrdersTable;