import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  LogOut, 
  RefreshCw,
  Activity,
  Wallet,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BalanceCard from './BalanceCard';
import HoldingsTable from './HoldingsTable';
import OrdersTable from './OrdersTable';
import TradingPanel from './TradingPanel';
import PositionsTable from './PositionsTable';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { userData, apiKey, logout, refreshUserData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    margins: null,
    holdings: [],
    orders: [],
    positions: []
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'trading', label: 'Trading', icon: Activity },
    { id: 'holdings', label: 'Holdings', icon: Wallet },
    { id: 'orders', label: 'Orders', icon: BarChart3 },
    { id: 'positions', label: 'Positions', icon: TrendingUp }
  ];

  const fetchDashboardData = async () => {
    if (!apiKey) return;
    
    setIsRefreshing(true);
    try {
      const [profileResponse, holdingsResponse, ordersResponse, positionsResponse] = await Promise.all([
        fetch(`/api/user/profile/${apiKey}`).then(res => res.json()),
        fetch(`/api/portfolio/holdings/${apiKey}`).then(res => res.json()),
        fetch(`/api/orders/${apiKey}`).then(res => res.json()),
        fetch(`/api/portfolio/positions/${apiKey}`).then(res => res.json())
      ]);

      setDashboardData({
        profile: profileResponse.profile,
        margins: profileResponse.margins,
        holdings: holdingsResponse || [],
        orders: ordersResponse || [],
        positions: positionsResponse || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [apiKey]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleRefresh = async () => {
    await fetchDashboardData();
    toast.success('Data refreshed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-white" />
                <h1 className="text-xl font-bold text-white">Zerodha Bot</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn btn-secondary"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={handleLogout}
                className="btn btn-danger"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info */}
        {dashboardData.profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="card glass-dark text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Welcome, {dashboardData.profile.user_name}!
                  </h2>
                  <p className="text-white text-opacity-70">
                    User ID: {dashboardData.profile.user_id} | 
                    Email: {dashboardData.profile.email} | 
                    Broker: {dashboardData.profile.broker}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white text-opacity-70">Last Login</div>
                  <div className="font-semibold">
                    {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Balance Cards */}
        {dashboardData.margins && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <BalanceCard margins={dashboardData.margins} />
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white text-opacity-70 hover:text-opacity-100 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-2 gap-6">
              <HoldingsTable holdings={dashboardData.holdings} />
              <OrdersTable orders={dashboardData.orders} />
            </div>
          )}
          
          {activeTab === 'trading' && (
            <TradingPanel apiKey={apiKey} onOrderPlaced={fetchDashboardData} />
          )}
          
          {activeTab === 'holdings' && (
            <HoldingsTable holdings={dashboardData.holdings} />
          )}
          
          {activeTab === 'orders' && (
            <OrdersTable orders={dashboardData.orders} />
          )}
          
          {activeTab === 'positions' && (
            <PositionsTable positions={dashboardData.positions} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;