import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  Activity, 
  LogOut, 
  RefreshCw,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from 'lucide-react'

const Dashboard = ({ profile, onLogout }) => {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchBalance = async () => {
    setRefreshing(true)
    try {
      const response = await axios.get('/api/balance', { withCredentials: true })
      setBalance(response.data)
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBalance()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0)
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="glass-effect rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trading Dashboard</h1>
                <p className="text-gray-600">Welcome, {profile?.user_name || profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchBalance}
                disabled={refreshing}
                className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Equity Balance */}
            <div className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-green-600 text-sm font-medium flex items-center">
                  <ArrowUpRight className="w-4 h-4" />
                  Equity
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Available Balance</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(balance?.margins?.equity?.available?.cash)}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Used: {formatCurrency(balance?.margins?.equity?.utilised?.debits)}
              </p>
            </div>

            {/* Commodity Balance */}
            <div className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-purple-600 text-sm font-medium flex items-center">
                  Commodity
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Available Balance</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(balance?.margins?.commodity?.available?.cash)}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Used: {formatCurrency(balance?.margins?.commodity?.utilised?.debits)}
              </p>
            </div>

            {/* Open Positions */}
            <div className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 text-sm font-medium flex items-center">
                  Positions
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Open Positions</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {balance?.positions?.net?.length || 0}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Day: {balance?.positions?.day?.length || 0}
              </p>
            </div>

            {/* Holdings */}
            <div className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <PieChart className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-orange-600 text-sm font-medium flex items-center">
                  Holdings
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">Total Holdings</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {balance?.holdings?.length || 0}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                Active investments
              </p>
            </div>
          </div>

          {/* Detailed View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Positions */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Open Positions
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {balance?.positions?.net?.length > 0 ? (
                  balance.positions.net.map((position, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{position.tradingsymbol}</p>
                          <p className="text-xs text-gray-500">{position.exchange}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          position.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {position.quantity > 0 ? 'LONG' : 'SHORT'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Qty</p>
                          <p className="font-medium">{Math.abs(position.quantity)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Avg Price</p>
                          <p className="font-medium">{formatCurrency(position.average_price)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">P&L</p>
                          <p className={`font-medium ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(position.pnl)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No open positions</p>
                  </div>
                )}
              </div>
            </div>

            {/* Holdings */}
            <div className="glass-effect rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                Holdings
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {balance?.holdings?.length > 0 ? (
                  balance.holdings.map((holding, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{holding.tradingsymbol}</p>
                          <p className="text-xs text-gray-500">{holding.exchange}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Qty</p>
                          <p className="font-medium">{holding.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Avg Price</p>
                          <p className="font-medium">{formatCurrency(holding.average_price)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">P&L</p>
                          <p className={`font-medium ${holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(holding.pnl)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <PieChart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No holdings</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">User ID</p>
                <p className="font-semibold">{profile?.user_id}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Email</p>
                <p className="font-semibold">{profile?.email}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Broker</p>
                <p className="font-semibold">{profile?.broker || 'Zerodha'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
