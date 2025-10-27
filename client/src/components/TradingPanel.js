import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TradingPanel = ({ apiKey, onOrderPlaced }) => {
  const [orderData, setOrderData] = useState({
    tradingsymbol: '',
    exchange: 'NSE',
    transaction_type: 'BUY',
    order_type: 'MARKET',
    quantity: '',
    product: 'MIS',
    price: '',
    validity: 'DAY'
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchSymbol = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // This would typically call a symbol search API
      // For demo purposes, we'll simulate some results
      const mockResults = [
        { tradingsymbol: 'RELIANCE', exchange: 'NSE', instrument_token: '738561' },
        { tradingsymbol: 'TCS', exchange: 'NSE', instrument_token: '2953217' },
        { tradingsymbol: 'INFY', exchange: 'NSE', instrument_token: '408065' },
        { tradingsymbol: 'HDFC', exchange: 'NSE', instrument_token: '341249' },
        { tradingsymbol: 'ICICIBANK', exchange: 'NSE', instrument_token: '1270529' }
      ].filter(item => 
        item.tradingsymbol.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search symbols');
    } finally {
      setIsSearching(false);
    }
  };

  const selectSymbol = (symbol) => {
    setOrderData(prev => ({
      ...prev,
      tradingsymbol: symbol.tradingsymbol,
      exchange: symbol.exchange,
      instrument_token: symbol.instrument_token
    }));
    setSearchResults([]);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    
    if (!orderData.tradingsymbol || !orderData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const response = await axios.post(`/api/orders/place/${apiKey}`, {
        ...orderData,
        quantity: parseInt(orderData.quantity),
        price: orderData.order_type === 'MARKET' ? 0 : parseFloat(orderData.price)
      });

      toast.success('Order placed successfully!');
      setOrderData({
        tradingsymbol: '',
        exchange: 'NSE',
        transaction_type: 'BUY',
        order_type: 'MARKET',
        quantity: '',
        product: 'MIS',
        price: '',
        validity: 'DAY'
      });
      
      if (onOrderPlaced) {
        onOrderPlaced();
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="grid grid-2 gap-6">
      {/* Order Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card glass-dark text-white"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-xl font-bold">Place Order</h3>
        </div>

        <form onSubmit={placeOrder} className="space-y-4">
          {/* Symbol Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Symbol *</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="tradingsymbol"
                value={orderData.tradingsymbol}
                onChange={(e) => {
                  handleInputChange(e);
                  searchSymbol(e.target.value);
                }}
                placeholder="Search symbol (e.g., RELIANCE)"
                className="input input-dark pl-10"
                required
              />
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => selectSymbol(result)}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                    >
                      <div className="font-medium">{result.tradingsymbol}</div>
                      <div className="text-gray-400 text-xs">{result.exchange}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Transaction Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOrderData(prev => ({ ...prev, transaction_type: 'BUY' }))}
                className={`flex-1 btn ${
                  orderData.transaction_type === 'BUY' ? 'btn-success' : 'btn-secondary'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                BUY
              </button>
              <button
                type="button"
                onClick={() => setOrderData(prev => ({ ...prev, transaction_type: 'SELL' }))}
                className={`flex-1 btn ${
                  orderData.transaction_type === 'SELL' ? 'btn-danger' : 'btn-secondary'
                }`}
              >
                <TrendingDown className="w-4 h-4" />
                SELL
              </button>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Order Type</label>
            <select
              name="order_type"
              value={orderData.order_type}
              onChange={handleInputChange}
              className="input input-dark w-full"
            >
              <option value="MARKET">Market</option>
              <option value="LIMIT">Limit</option>
              <option value="SL">Stop Loss</option>
              <option value="SL-M">Stop Loss Market</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={orderData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              className="input input-dark w-full"
              required
              min="1"
            />
          </div>

          {/* Price (for limit orders) */}
          {orderData.order_type === 'LIMIT' && (
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={orderData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="input input-dark w-full"
                step="0.05"
              />
            </div>
          )}

          {/* Product */}
          <div>
            <label className="block text-sm font-medium mb-2">Product</label>
            <select
              name="product"
              value={orderData.product}
              onChange={handleInputChange}
              className="input input-dark w-full"
            >
              <option value="MIS">MIS (Intraday)</option>
              <option value="CNC">CNC (Delivery)</option>
              <option value="NRML">NRML (Positional)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPlacingOrder}
            className="btn btn-primary w-full"
          >
            {isPlacingOrder ? (
              <>
                <div className="loading-spinner w-4 h-4"></div>
                Placing Order...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Place Order
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card glass-dark text-white"
      >
        <h3 className="text-xl font-bold mb-6">Order Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-white text-opacity-70">Symbol:</span>
            <span className="font-semibold">{orderData.tradingsymbol || 'N/A'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-white text-opacity-70">Side:</span>
            <span className={`font-semibold ${
              orderData.transaction_type === 'BUY' ? 'text-green-400' : 'text-red-400'
            }`}>
              {orderData.transaction_type}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-white text-opacity-70">Type:</span>
            <span className="font-semibold">{orderData.order_type}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-white text-opacity-70">Quantity:</span>
            <span className="font-semibold">{orderData.quantity || '0'}</span>
          </div>
          
          {orderData.order_type === 'LIMIT' && orderData.price && (
            <div className="flex justify-between">
              <span className="text-white text-opacity-70">Price:</span>
              <span className="font-semibold">₹{orderData.price}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-white text-opacity-70">Product:</span>
            <span className="font-semibold">{orderData.product}</span>
          </div>
          
          {orderData.quantity && orderData.price && orderData.order_type === 'LIMIT' && (
            <div className="border-t border-white border-opacity-20 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Value:</span>
                <span>₹{(parseFloat(orderData.quantity) * parseFloat(orderData.price)).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TradingPanel;