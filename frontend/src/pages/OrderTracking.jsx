import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';
import { ChefHat, ShoppingBag, Clock, Compass, CheckCircle2, User, Phone, MapPin, ArrowLeft, ShieldCheck, Truck, Sparkles, Navigation } from 'lucide-react';

const OrderTracking = () => {
  const { id } = useParams();
  const location = useLocation();
  const socket = useSocket();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  // Fetch or restore order
  useEffect(() => {
    if (order) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success && res.data.data) {
          setOrder(res.data.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Backend order fetch offline, searching local demo orders cache');
      }

      // Local storage fallback for client demo
      const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
      const found = demoOrders.find(o => o._id === id) || demoOrders[0] || {
        _id: id || 'ORD-998124',
        orderType: 'delivery',
        status: 'Preparing',
        totalAmount: 947,
        createdAt: new Date().toISOString(),
        items: [
          { menuItem: { name: 'Hyderabadi Dum Biryani', price: 399 }, quantity: 1, price: 399 },
          { menuItem: { name: 'Truffle Mushroom Pizza', price: 549 }, quantity: 1, price: 549 }
        ],
        deliveryAddress: {
          label: 'Home',
          street: '742 Evergreen Terrace, Penthouse 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        driverInfo: {
          name: 'Alex Vance',
          phone: '+1 (555) 987-6543',
          vehicle: 'Yamaha EV Scooter (NY-884)'
        }
      };

      setOrder(found);
      setLoading(false);
    };

    fetchOrder();
  }, [id, order]);

  // Setup WebSocket status updates listener
  useEffect(() => {
    if (!socket || !id) return;

    socket.on('orderStatusUpdated', (data) => {
      if (data.orderId === id) {
        setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
      }
    });

    return () => {
      socket.off('orderStatusUpdated');
    };
  }, [socket, id]);

  const stages = [
    { id: 'Placed', label: 'Order Placed', desc: 'Received by kitchen', icon: ShoppingBag },
    { id: 'Preparing', label: 'Kitchen Preparing', desc: 'Chef cooking your feast', icon: ChefHat },
    { id: 'Out for Delivery', label: 'Out for Delivery', desc: 'Driver en-route to you', icon: Truck },
    { id: 'Delivered', label: 'Order Delivered', desc: 'Savor your meal', icon: CheckCircle2 }
  ];

  const getStageIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 3;
    if (s.includes('out') || s.includes('delivery') || s.includes('driver')) return 2;
    if (s.includes('prep') || s.includes('cook') || s.includes('confirm')) return 1;
    return 0;
  };

  const currentStageIndex = getStageIndex(order?.status);

  const handleSimulateStatus = (newStatus) => {
    setOrder(prev => prev ? { ...prev, status: newStatus } : prev);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  const items = order?.items || [];
  const address = order?.deliveryAddress || {};

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header & Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <Link to="/my-orders" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white flex items-center gap-3">
              Order #{order?._id}
              <span className="text-xs font-sans px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                Live Tracking
              </span>
            </h1>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Estimated Arrival</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">18 - 25 Mins</span>
          </div>
        </div>

        {/* Demo Presentation Interactive Status Changer */}
        <div className="rounded-2xl bg-gray-900/90 border border-amber-500/30 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xl">
          <span className="text-amber-400 font-bold flex items-center gap-1.5 shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" /> Client Demo Simulation Controls:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {['Placed', 'Preparing', 'Out for Delivery', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => handleSimulateStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                  order?.status === st
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-gray-950 text-gray-400 border border-gray-800 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Stage Visual Stepper Timeline */}
        <div className="rounded-3xl bg-gray-900/80 border border-gray-800 p-6 sm:p-8 space-y-8 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-white">Live Delivery Timeline</h2>
            <span className="text-xs text-gray-400 font-mono">Updated Just Now</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isPassed = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stage.id}
                  className={`flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : isPassed
                      ? 'bg-gray-950 border-gray-800 text-gray-300'
                      : 'bg-gray-950/40 border-gray-900 text-gray-600 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isPassed
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-gray-900 text-gray-600 border border-gray-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isPassed ? 'text-white' : 'text-gray-500'}`}>
                      {stage.label}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Driver Map & Receipt Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Simulated Map Canvas */}
          <div className="lg:col-span-7 rounded-3xl bg-gray-900/90 border border-gray-800 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 opacity-90 pointer-events-none" />
            
            {/* Grid overlay lines simulating roads */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFB800_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 animate-spin text-amber-400" /> Real-Time GPS Tracking Simulation
              </span>
              <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Driver Online
              </span>
            </div>

            {/* Map Pin graphic */}
            <div className="relative z-10 my-8 flex flex-col items-center justify-center text-center space-y-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 animate-ping absolute inset-0" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-2xl relative">
                  <Truck className="w-8 h-8" />
                </div>
              </div>
              <h3 className="font-extrabold text-sm text-white">Driver On The Way</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                Approaching {address.street || '742 Evergreen Terrace'} with your warm order.
              </p>
            </div>

            {/* Driver Contact Info Footer Card */}
            <div className="relative z-10 p-4 rounded-2xl bg-gray-950/90 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-amber-400 font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{order?.driverInfo?.name || 'Alex Vance'}</h4>
                  <span className="text-[10px] text-gray-400">{order?.driverInfo?.vehicle || 'Speedy EV Fleet Rider'}</span>
                </div>
              </div>
              <a
                href={`tel:${order?.driverInfo?.phone || '+15559876543'}`}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call Driver
              </a>
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="lg:col-span-5 rounded-3xl bg-gray-900/90 border border-gray-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-serif font-extrabold text-white border-b border-gray-800 pb-3 flex items-center justify-between">
              <span>Order Receipt</span>
              <span className="text-amber-400 font-mono text-xs">Total: ₹{order?.totalAmount || 947}</span>
            </h3>

            <div className="space-y-3">
              {items.map((item, idx) => {
                const menuItem = item.menuItem || {};
                const name = menuItem.name || item.name || 'Gourmet Dish';
                const price = menuItem.price || item.price || 299;
                return (
                  <div key={idx} className="flex items-center justify-between text-xs text-gray-300">
                    <div>
                      <p className="font-bold text-white">{name}</p>
                      {item.specialInstructions && (
                        <p className="text-[10px] text-amber-400 italic">Note: {item.specialInstructions}</p>
                      )}
                    </div>
                    <div className="text-right font-mono">
                      <span>{item.quantity} x ₹{price}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Delivery Address</span>
                <span className="text-gray-200 truncate max-w-[180px]">{address.street || '742 Evergreen Terrace'}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-gray-200 uppercase font-mono">{order?.paymentMethod || 'Card'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderTracking;
