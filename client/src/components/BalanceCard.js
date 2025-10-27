import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const BalanceCard = ({ margins }) => {
  const equity = margins?.equity?.available?.cash || 0;
  const collateral = margins?.equity?.available?.collateral || 0;
  const total = equity + collateral;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const cards = [
    {
      title: 'Available Cash',
      amount: equity,
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-500'
    },
    {
      title: 'Collateral',
      amount: collateral,
      icon: Wallet,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Total Balance',
      amount: total,
      icon: TrendingUp,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card glass-dark text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor} bg-opacity-20`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-white text-opacity-70">{card.title}</div>
                  <div className="text-2xl font-bold">{formatCurrency(card.amount)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${card.bgColor}`}></div>
                <span className="text-sm text-white text-opacity-70">
                  {card.title === 'Total Balance' ? 'Portfolio Value' : 'Available'}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BalanceCard;