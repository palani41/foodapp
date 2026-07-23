import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../utils/api';
import { useSocket } from '../context/SocketContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Edit, Trash2, CheckCircle2, ShieldCheck, Ticket, Users, Layers, ShoppingCart, IndianRupee, Image, Sparkles, TrendingUp, RefreshCw, X } from 'lucide-react';

const REVENUE_DATA = [
  { name: 'Mon', sales: 14200 },
  { name: 'Tue', sales: 18900 },
  { name: 'Wed', sales: 15400 },
  { name: 'Thu', sales: 22800 },
  { name: 'Fri', sales: 34500 },
  { name: 'Sat', sales: 48200 },
  { name: 'Sun', sales: 41000 },
];

const INITIAL_ORDERS = [
  {
    _id: 'ORD-882190',
    user: { name: 'Alice Customer', email: 'customer@foodapp.com' },
    items: [{ menuItem: { name: 'Hyderabadi Dum Biryani', price: 399 }, quantity: 2 }],
    totalAmount: 897,
    status: 'Preparing',
    orderType: 'delivery',
    createdAt: '10 mins ago'
  },
  {
    _id: 'ORD-774129',
    user: { name: 'David Smith', email: 'david@company.com' },
    items: [{ menuItem: { name: 'Truffle Mushroom Pizza', price: 549 }, quantity: 1 }],
    totalAmount: 649,
    status: 'Out for Delivery',
    orderType: 'delivery',
    createdAt: '22 mins ago'
  },
  {
    _id: 'ORD-653102',
    user: { name: 'Sarah Miller', email: 'sarah@gmail.com' },
    items: [{ menuItem: { name: 'Peri-Peri Beef Burger', price: 329 }, quantity: 3 }],
    totalAmount: 1120,
    status: 'Placed',
    orderType: 'dine-in',
    createdAt: '5 mins ago'
  }
];

const AdminDashboard = () => {
  const socket = useSocket();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'menu', 'analytics'
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [menuItems, setMenuItems] = useState([
    { _id: 'm1', name: 'Hyderabadi Dum Biryani', price: 399, category: 'Mains', isVeg: false },
    { _id: 'm2', name: 'Truffle Mushroom Pizza', price: 549, category: 'Pizza', isVeg: true },
    { _id: 'm3', name: 'Charred Peri-Peri Burger', price: 329, category: 'Burgers', isVeg: false }
  ]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  
  // New Item Modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Mains', isVeg: true });

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await api.get('/orders');
      if (ordersRes.data.success && ordersRes.data.data.length > 0) setOrders(ordersRes.data.data);

      const menuRes = await api.get('/menu');
      if (menuRes.data.success && menuRes.data.data.length > 0) setMenuItems(menuRes.data.data);
    } catch (err) {
      console.warn('Backend admin fetch offline, using rich demo fallback stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('newOrder', (data) => {
      setNotification(`⚡ Live Order Alert! ID: ${data.orderId.substring(0, 8)}... (Total: ₹${data.total})`);
      setTimeout(() => setNotification(''), 6000);
      fetchData();
    });
  }, [socket]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
    } catch (e) {
      console.warn('Backend status update offline, updated locally');
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const item = {
      _id: `m-${Date.now()}`,
      name: newItem.name,
      price: Number(newItem.price),
      category: newItem.category,
      isVeg: newItem.isVeg
    };
    setMenuItems([...menuItems, item]);
    setShowItemModal(false);
    setNewItem({ name: '', price: '', category: 'Mains', isVeg: true });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Real-time Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-amber-500 text-slate-950 px-5 py-3 font-extrabold shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce text-xs">
          <Sparkles className="w-4 h-4" /> {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4" /> Executive Management Console
            </div>
            <h1 className="text-3xl font-serif font-extrabold text-white">
              Restaurant Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowItemModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" /> Add Menu Item
            </button>
          </div>
        </div>

        {/* Analytics Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Total Revenue', value: '₹1,95,000', change: '+18.4%', icon: IndianRupee, color: 'text-amber-400' },
            { title: 'Active Orders', value: orders.length, change: 'Live Now', icon: ShoppingCart, color: 'text-emerald-400' },
            { title: 'Menu Items', value: menuItems.length, change: 'Available', icon: Layers, color: 'text-cyan-400' },
            { title: 'Customer Rating', value: '4.9 ★', change: '1,240 Reviews', icon: TrendingUp, color: 'text-yellow-400' },
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="rounded-3xl bg-gray-900/80 border border-gray-800 p-5 flex items-center justify-between shadow-xl">
                <div>
                  <span className="text-xs text-gray-400 font-medium block">{kpi.title}</span>
                  <h3 className={`text-2xl font-extrabold font-mono mt-1 ${kpi.color}`}>{kpi.value}</h3>
                  <span className="text-[10px] text-gray-500 mt-1 block">{kpi.change}</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-center text-amber-400">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          {[
            { id: 'orders', label: 'Live Orders Management', icon: ShoppingCart },
            { id: 'menu', label: 'Menu Catalog Manager', icon: Layers },
            { id: 'analytics', label: 'Revenue Trends', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-serif font-extrabold text-white">Live Orders Stream</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-gray-950 text-gray-400 uppercase font-mono text-[10px] border-b border-gray-800">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-950/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-400">#{o._id}</td>
                      <td className="p-3 font-semibold text-white">{o.user?.name || 'Alice Customer'}</td>
                      <td className="p-3 uppercase text-[10px] font-mono text-gray-400">{o.orderType || 'Delivery'}</td>
                      <td className="p-3 font-extrabold font-mono text-gray-100">₹{o.totalAmount}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          className="rounded-xl border border-gray-800 bg-gray-950 px-2.5 py-1 text-xs text-amber-300 focus:border-amber-500 focus:outline-none cursor-pointer"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Menu Manager */}
        {activeTab === 'menu' && (
          <div className="rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-extrabold text-white">Menu Item Catalog</h3>
              <button
                onClick={() => setShowItemModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold cursor-pointer"
              >
                + Add Dish
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div key={item._id} className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <span className="font-mono text-amber-400 font-bold">₹{item.price}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase font-mono">{item.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Revenue Analytics Chart */}
        {activeTab === 'analytics' && (
          <div className="rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-serif font-extrabold text-white">Weekly Revenue Trends</h3>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#090d16', borderColor: '#374151', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="sales" stroke="#FFB800" fill="rgba(255,184,0,0.15)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

      {/* Add Dish Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-gray-900 border border-gray-800 p-6 space-y-4 text-gray-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-serif font-bold text-white">Add New Menu Dish</h3>
              <button onClick={() => setShowItemModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saffron Chicken Tikka"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="399"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="Appetizers">Appetizers</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Mains">Mains</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 cursor-pointer mt-2"
              >
                Save & Publish Item
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
