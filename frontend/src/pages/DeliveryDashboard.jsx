import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';
import { Truck, MapPin, Phone, User, Clock, CheckCircle2, Navigation, ShieldCheck, Sparkles } from 'lucide-react';

const INITIAL_DELIVERIES = [
  {
    _id: 'ORD-882190',
    user: { name: 'Alice Customer', phone: '+1 (555) 123-4567' },
    status: 'Out for Delivery',
    totalAmount: 897,
    orderType: 'delivery',
    deliveryAddress: {
      street: '742 Evergreen Terrace, Penthouse 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    items: [{ menuItem: { name: 'Hyderabadi Dum Biryani' }, quantity: 2 }]
  },
  {
    _id: 'ORD-774129',
    user: { name: 'David Smith', phone: '+1 (555) 987-1122' },
    status: 'Preparing',
    totalAmount: 649,
    orderType: 'delivery',
    deliveryAddress: {
      street: '150 Fifth Avenue, Suite 1200',
      city: 'New York',
      state: 'NY',
      zipCode: '10011'
    },
    items: [{ menuItem: { name: 'Truffle Mushroom Pizza' }, quantity: 1 }]
  }
];

const DeliveryDashboard = () => {
  const socket = useSocket();
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [notification, setNotification] = useState('');

  const fetchDeliveries = async () => {
    try {
      const res = await api.get('/orders');
      if (res.data.success && res.data.data.length > 0) {
        setDeliveries(res.data.data);
      }
    } catch (err) {
      console.warn('Backend driver fetch offline, using fallback active assignments');
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('deliveryAssigned', (data) => {
      setNotification(`New delivery assigned: Order #${data.orderId.substring(0, 8)}...`);
      setTimeout(() => setNotification(''), 6000);
      fetchDeliveries();
    });
  }, [socket]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setDeliveries(prev => prev.map(d => d._id === orderId ? { ...d, status: newStatus } : d));
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
    } catch (err) {
      console.warn('Backend status update offline, updated driver state locally');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Banner */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-cyan-500 text-slate-950 px-5 py-3 font-extrabold shadow-2xl flex items-center gap-2 border border-cyan-300 animate-bounce text-xs">
          <Truck className="w-4 h-4" /> {notification}
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-widest mb-1">
              <Truck className="w-4 h-4" /> Speedy Express Fleet Portal
            </div>
            <h1 className="text-3xl font-serif font-extrabold text-white">
              Delivery Driver Console
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            ● Driver Status: Active & En-Route
          </span>
        </div>

        {/* Deliveries Stream */}
        <div className="space-y-4">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" /> Active Delivery Jobs ({deliveries.length})
          </h2>

          <div className="space-y-4">
            {deliveries.map((del) => {
              const address = del.deliveryAddress || {};
              return (
                <div
                  key={del._id}
                  className="rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div>
                      <span className="font-mono text-xs text-amber-400 font-extrabold">#{del._id}</span>
                      <h3 className="font-extrabold text-base text-white mt-0.5">{del.user?.name || 'Alice Customer'}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-xs">
                      {del.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 bg-gray-950 p-3.5 rounded-2xl border border-gray-850">
                      <span className="text-gray-400 font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Drop Location:
                      </span>
                      <p className="text-white font-medium">
                        {address.street || '742 Evergreen Terrace'}, {address.city || 'New York'}, {address.state || 'NY'}
                      </p>
                    </div>

                    <div className="space-y-1 bg-gray-950 p-3.5 rounded-2xl border border-gray-850">
                      <span className="text-gray-400 font-bold flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" /> Contact Customer:
                      </span>
                      <p className="text-amber-400 font-mono font-bold">
                        {del.user?.phone || '+1 (555) 123-4567'}
                      </p>
                    </div>
                  </div>

                  {/* Actions for Status Transition */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-400 font-mono">Collect Payment: <strong className="text-white font-extrabold">₹{del.totalAmount}</strong></span>

                    <div className="flex items-center gap-2">
                      {del.status !== 'Out for Delivery' && del.status !== 'Delivered' && (
                        <button
                          onClick={() => handleUpdateStatus(del._id, 'Out for Delivery')}
                          className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 cursor-pointer"
                        >
                          Start Delivery
                        </button>
                      )}
                      {del.status !== 'Delivered' && (
                        <button
                          onClick={() => handleUpdateStatus(del._id, 'Delivered')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold hover:bg-emerald-400 cursor-pointer shadow-lg shadow-emerald-500/20"
                        >
                          Mark Delivered ✅
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeliveryDashboard;
