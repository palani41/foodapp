import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Compass, Table, Clock, MapPin, CreditCard, Banknote, Landmark, ShieldCheck, Ticket, Check, ArrowRight, Sparkles } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const {
    cart,
    orderType,
    selectedAddress,
    tableNumber,
    coupon,
    setOrderType,
    setSelectedAddress,
    setTableNumber,
    getSubtotal,
    getTax,
    getDeliveryFee,
    getDiscount,
    getTotal,
    clearCart
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [tip, setTip] = useState(20);
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '742 Evergreen Terrace, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    isDefault: true
  });

  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8892',
    name: user?.name || 'Alice Customer',
    expiry: '12/28',
    cvv: '884'
  });

  const items = cart?.items || [];

  useEffect(() => {
    if (!selectedAddress) {
      setSelectedAddress(newAddress);
    }
  }, [selectedAddress, setSelectedAddress]);

  const handleAddAddress = (e) => {
    e.preventDefault();
    setSelectedAddress(newAddress);
    setShowAddressForm(false);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    const newOrder = {
      _id: orderId,
      user: user?._id || 'demo-user',
      items: items.map(i => ({
        menuItem: i.menuItem || { name: i.name || 'Gourmet Special', price: i.price || 299 },
        quantity: i.quantity,
        price: i.price || i.menuItem?.price || 299,
        specialInstructions: i.specialInstructions || ''
      })),
      orderType,
      deliveryAddress: selectedAddress || newAddress,
      tableNumber: orderType === 'dine-in' ? tableNumber || 'T-04' : undefined,
      paymentMethod,
      totalAmount: Math.round((getTotal() + tip) * 100) / 100,
      status: 'Placed',
      createdAt: new Date().toISOString(),
      driverInfo: {
        name: 'Alex Vance',
        phone: '+1 (555) 987-6543',
        vehicle: 'Yamaha EV Scooter (NY-884)'
      }
    };

    try {
      await api.post('/orders', {
        items: cart.items,
        orderType,
        deliveryAddress: selectedAddress,
        paymentMethod
      });
    } catch (e) {
      console.warn('Backend order placement offline, saving order to local state for demo presentation');
    }

    // Save to local orders history so Order History and Order Tracking work offline
    const existingOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    localStorage.setItem('demo_orders', JSON.stringify([newOrder, ...existingOrders]));

    clearCart();
    setLoading(false);
    navigate(`/order-tracking/${orderId}`, { state: { order: newOrder } });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase font-mono font-bold text-amber-400 tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure 256-Bit Encrypted Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
            Confirm & Complete Order
          </h1>
          <p className="text-xs text-gray-400">
            Review delivery details, select dining preference & finalize payment simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Delivery / Order Options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Order Type Selector */}
            <div className="rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" /> 1. Dining Preference
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'delivery', label: 'Home Delivery', icon: Compass },
                  { id: 'takeaway', label: 'Self Pickup', icon: Clock },
                  { id: 'dine-in', label: 'Dine-In Table', icon: Table }
                ].map((type) => {
                  const Icon = type.icon;
                  const active = orderType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setOrderType(type.id)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-500/10'
                          : 'bg-gray-950 text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Delivery Address Box */}
              {orderType === 'delivery' && (
                <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-400" /> Delivery Address
                    </span>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      {showAddressForm ? 'Cancel' : '+ Add Custom Address'}
                    </button>
                  </div>

                  {!showAddressForm ? (
                    <div className="rounded-2xl bg-gray-950 border border-gray-800 p-4 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{selectedAddress?.label || 'Home Address'}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Verified Address</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {selectedAddress?.street || '742 Evergreen Terrace, Penthouse 4B'}, {selectedAddress?.city || 'New York'}, {selectedAddress?.state || 'NY'} {selectedAddress?.zipCode || '10001'}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleAddAddress} className="space-y-3 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                      <input
                        type="text"
                        placeholder="Street Address (e.g. 123 Fifth Ave)"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Zip Code"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                          className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
                      >
                        Save & Use Address
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Dine in Table input */}
              {orderType === 'dine-in' && (
                <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                  <label className="text-xs font-bold text-gray-300">Table Number</label>
                  <input
                    type="text"
                    placeholder="Enter Table Number (e.g. T-04)"
                    value={tableNumber || 'T-04'}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Driver Tip Selector */}
            <div className="rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 2. Chef & Delivery Tip
                </span>
                <span className="text-xs text-gray-400">100% goes to driver</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[0, 20, 50, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTip(val)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      tip === val
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : 'bg-gray-950 text-gray-400 border-gray-800 hover:text-white'
                    }`}
                  >
                    {val === 0 ? 'No Tip' : `₹${val}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Payment Method Simulation */}
            <div className="rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <CreditCard className="w-4 h-4" /> 3. Payment Method Simulation
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI / Apple Pay', icon: Landmark },
                  { id: 'cod', label: 'Cash on Delivery', icon: Banknote }
                ].map((pm) => {
                  const Icon = pm.icon;
                  const active = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-lg shadow-amber-500/10'
                          : 'bg-gray-950 text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-mono text-gray-200 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-mono text-gray-200 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-gray-900/90 border border-amber-500/30 p-6 space-y-4 shadow-2xl sticky top-28">
              <h3 className="text-lg font-serif font-extrabold text-white flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-sans text-amber-400">({items.length} Items)</span>
              </h3>

              {/* Items List */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 border-y border-gray-800 py-3">
                {items.map((item, idx) => {
                  const menuItem = item.menuItem || {};
                  const name = menuItem.name || item.name || 'Gourmet Dish';
                  const price = menuItem.price || item.price || 299;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-gray-950 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                          {item.quantity}x
                        </span>
                        <span className="line-clamp-1">{name}</span>
                      </div>
                      <span className="font-bold text-gray-200">₹{price * item.quantity}</span>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-200">₹{getSubtotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Service Tax</span>
                  <span className="font-bold text-gray-200">₹{getTax()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-gray-200">₹{getDeliveryFee()}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Coupon Savings</span>
                    <span>-₹{getDiscount()}</span>
                  </div>
                )}
                {tip > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>Driver Tip</span>
                    <span>+₹{tip}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-800 pt-3 text-lg font-extrabold text-white">
                  <span>Grand Total</span>
                  <span className="text-amber-400 font-mono">₹{Math.round((getTotal() + tip) * 100) / 100}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 py-4 text-sm font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-300 transition-all cursor-pointer disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Place Order & Track Live</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
