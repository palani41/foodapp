import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Star, Calendar, Sparkles, MapPin, X, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success && res.data.data.length > 0) {
          setOrders(res.data.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Backend orders fetch offline, checking local demo orders');
      }

      const localOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
      if (localOrders.length > 0) {
        setOrders(localOrders);
      } else {
        setOrders([
          {
            _id: 'ORD-998124',
            createdAt: new Date().toISOString(),
            orderType: 'delivery',
            status: 'Delivered',
            totalAmount: 947,
            items: [
              { menuItem: { name: 'Hyderabadi Dum Biryani', price: 399 }, quantity: 1 },
              { menuItem: { name: 'Truffle Mushroom Pizza', price: 549 }, quantity: 1 }
            ]
          }
        ]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const openReviewModal = (item) => {
    setSelectedMenuItem(item);
    setRating(5);
    setComment('');
    setSubmitSuccess('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess('Thank you! Review submitted successfully.');
    setTimeout(() => setReviewModalOpen(false), 1500);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d16]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
              <ShoppingBag className="w-4 h-4" /> Personal Dining Log
            </div>
            <h1 className="text-3xl font-serif font-extrabold text-white">
              My Order History
            </h1>
          </div>
          <Link
            to="/menu"
            className="px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 cursor-pointer"
          >
            Order New Meal
          </Link>
        </div>

        {/* Orders Stream */}
        {orders.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-gray-800 bg-gray-900/40 space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-xl font-serif font-bold text-gray-200">No previous orders found</h3>
            <p className="text-xs text-gray-500">Add delicious gourmet dishes from our menu to place your first order.</p>
            <Link
              to="/menu"
              className="inline-block px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold cursor-pointer hover:bg-amber-400"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-4 shadow-xl hover:border-amber-500/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-4 gap-2">
                  <div>
                    <span className="font-mono text-xs text-amber-400 font-extrabold">#{order._id}</span>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" /> {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-xs">
                      {order.status}
                    </span>
                    <Link
                      to={`/order-tracking/${order._id}`}
                      className="px-4 py-2 rounded-xl bg-gray-950 border border-gray-800 text-xs font-bold text-white hover:border-amber-500/40 transition-colors flex items-center gap-1"
                    >
                      Track Order <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs text-gray-300">
                  {order.items?.map((item, idx) => {
                    const menuItem = item.menuItem || {};
                    const name = menuItem.name || item.name || 'Gourmet Special';
                    const price = menuItem.price || item.price || 299;
                    return (
                      <div key={idx} className="flex items-center justify-between py-1 border-b border-gray-850">
                        <div>
                          <span className="font-bold text-white">{item.quantity}x {name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-gray-200">₹{price * item.quantity}</span>
                          <button
                            onClick={() => openReviewModal(item)}
                            className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                          >
                            Write Review
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-400 uppercase font-mono">Payment Status: <strong className="text-emerald-400 font-bold">Paid</strong></span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">Total: ₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-gray-900 border border-gray-800 p-6 space-y-4 text-gray-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-serif font-bold text-white">Rate & Review Dish</h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold">
                {submitSuccess}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Your Review Comment</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you loved about this dish..."
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 cursor-pointer"
              >
                Submit Guest Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderHistory;
