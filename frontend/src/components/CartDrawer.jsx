import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, Ticket, ArrowRight, NotebookPen, Sparkles, ShoppingBag } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    cart,
    coupon,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getTax,
    getDeliveryFee,
    getDiscount,
    getTotal
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [activeInstructions, setActiveInstructions] = useState(null);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput) return;
    setCouponError('');
    setCouponSuccess('');
    
    const res = await applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleQuickCoupon = async (code) => {
    setCouponInput(code);
    setCouponError('');
    setCouponSuccess('');
    const res = await applyCoupon(code);
    if (res.success) {
      setCouponSuccess(res.message);
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckoutRedirect = () => {
    onClose();
    navigate('/checkout');
  };

  const items = cart?.items || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Overlay background */}
      <div
        className="absolute inset-0 bg-gray-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-6">
        <div className="w-screen max-w-md transform bg-gray-950 border-l border-gray-800 text-gray-100 shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-extrabold text-white flex items-center gap-2">
                  Your Order Bag
                </h2>
                <p className="text-[11px] text-gray-400 font-sans">
                  {items.reduce((sum, i) => sum + i.quantity, 0)} Items Selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-center py-12">
                <div className="rounded-full bg-gray-900 border border-gray-800 p-5 mb-4">
                  <ShoppingBag className="h-10 w-10 text-gray-600 animate-bounce" />
                </div>
                <h3 className="text-xl font-serif font-extrabold text-gray-200">Your bag is empty</h3>
                <p className="text-xs text-gray-400 max-w-xs mt-2 leading-relaxed">
                  Explore our artisanal menu and add your favorite dishes to start your order.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Explore Gourmet Menu
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const menuItem = item.menuItem || {};
                const name = menuItem.name || item.name || 'Gourmet Special';
                const price = menuItem.price || item.price || 0;
                const image = menuItem.image || item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80';
                const itemId = menuItem._id || item._id;

                return (
                  <div
                    key={itemId || idx}
                    className="flex flex-col gap-3 rounded-2xl border border-gray-800/80 bg-gray-900/50 p-3.5 hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex gap-3">
                      {/* Item Image */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-800 border border-gray-800">
                        <img
                          src={getImageUrl(image)}
                          alt={name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>

                      {/* Details & Controls */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-gray-100 line-clamp-1">{name}</h4>
                          <span className="font-bold text-amber-400 text-sm">₹{price * item.quantity}</span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity adjusters */}
                          <div className="flex items-center gap-2 rounded-xl bg-gray-950 border border-gray-800 px-2 py-1">
                            <button
                              onClick={() => updateCartItem(itemId, item.quantity - 1, item.specialInstructions)}
                              className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-bold text-gray-200 px-1">{item.quantity}</span>
                            <button
                              onClick={() => updateCartItem(itemId, item.quantity + 1, item.specialInstructions)}
                              className="text-gray-400 hover:text-white p-0.5 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setActiveInstructions(activeInstructions === idx ? null : idx)}
                              className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
                            >
                              <NotebookPen className="h-3.5 w-3.5" /> Note
                            </button>
                            <button
                              onClick={() => removeFromCart(itemId)}
                              className="text-gray-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special instruction field toggle */}
                    {activeInstructions === idx && (
                      <div className="mt-1 pt-2 border-t border-gray-800/80">
                        <input
                          type="text"
                          placeholder="Special instructions (e.g. less spicy, no onions)..."
                          value={item.specialInstructions || ''}
                          onChange={(e) => updateCartItem(itemId, item.quantity, e.target.value)}
                          className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:border-amber-500/50 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Quick Coupons Box */}
            {items.length > 0 && (
              <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Ticket className="h-4 w-4" /> Apply Promo Code
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Try SAVER20</span>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 uppercase rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-amber-300 font-mono placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-500/20 border border-amber-500/30 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/30 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {/* Preset Coupon Quick Pills */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-gray-400">Quick Codes:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickCoupon('SAVER20')}
                    className="px-2 py-0.5 rounded-lg bg-gray-800 text-[10px] font-mono text-amber-300 border border-gray-700 hover:border-amber-500 cursor-pointer"
                  >
                    SAVER20 (20% OFF)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickCoupon('WELCOME50')}
                    className="px-2 py-0.5 rounded-lg bg-gray-800 text-[10px] font-mono text-amber-300 border border-gray-700 hover:border-amber-500 cursor-pointer"
                  >
                    WELCOME50 (₹100 OFF)
                  </button>
                </div>

                {couponError && <p className="text-xs text-red-400 font-semibold">{couponError}</p>}
                {couponSuccess && <p className="text-xs text-emerald-400 font-semibold">{couponSuccess}</p>}

                {coupon && (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400">
                    <span>Applied: <strong className="font-mono">{coupon.code}</strong></span>
                    <button onClick={removeCoupon} className="text-xs underline hover:text-emerald-300 cursor-pointer">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer breakdown & checkout action */}
          {items.length > 0 && (
            <div className="border-t border-gray-800 bg-gray-950 p-6 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-200">₹{getSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Service Tax (10%)</span>
                  <span className="font-semibold text-gray-200">₹{getTax()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-200">₹{getDeliveryFee()}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount Coupon</span>
                    <span>-₹{getDiscount()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-800/80 pt-2 text-base font-extrabold text-white">
                  <span>Total Amount</span>
                  <span className="text-amber-400">₹{getTotal()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutRedirect}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-300 transition-all cursor-pointer mt-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
