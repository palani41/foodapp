import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, MapPin } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center bg-slate-950 text-gray-200">
      <div className="rounded-full bg-green-500/10 p-5 border border-green-500/20 mb-6">
        <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
      </div>

      <h1 className="font-serif text-3xl font-bold tracking-tight text-white mb-2">Order Confirmed!</h1>
      <p className="text-gray-400 max-w-md text-sm mb-6">
        Your kitchen ticket is registered! Our culinary experts have begun preparing your meal.
      </p>

      {orderId && (
        <div className="rounded-xl border border-gray-850 bg-gray-900/60 p-4 mb-8 font-mono text-xs text-amber-500 select-all border-dashed">
          Order ID: #{orderId}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {orderId ? (
          <Link
            to={`/order-tracking/${orderId}`}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400 hover:shadow-lg transition-all"
          >
            <MapPin className="h-4.5 w-4.5" /> Track Live Order
          </Link>
        ) : (
          <Link
            to="/my-orders"
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400 hover:shadow-lg transition-all"
          >
            View Order History
          </Link>
        )}
        <Link
          to="/"
          className="flex items-center gap-1.5 rounded-xl border border-gray-850 bg-gray-900 px-6 py-3 text-sm font-bold text-gray-300 hover:border-amber-500/30 hover:text-amber-500 transition-all"
        >
          <ShoppingBag className="h-4.5 w-4.5" /> Browse More Dishes
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
