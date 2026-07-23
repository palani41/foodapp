import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ChefHat, Sparkles, Plus, Star, CookingPot, Flame, Check, ArrowRight } from 'lucide-react';

const Specials = () => {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');

  const specials = [
    {
      id: 'sp-1',
      name: 'Hyderabadi Royal Dum Biryani',
      originalPrice: 499,
      price: 399,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=600&q=80',
      chefNotes: 'Authentic slow-dum cooked basmati rice with tender succulent chicken, Kashmiri saffron, fried shallots, and fresh mint. Served with Mirchi ka Salan & Burani Raita.',
      prepTime: '25 mins',
      isVeg: false
    },
    {
      id: 'sp-2',
      name: 'Signature Butter Chicken & Garlic Naan',
      originalPrice: 529,
      price: 449,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
      chefNotes: 'Charcoal-grilled chicken tikka simmered in a velvety, rich tomato & butter gravy with kasuri methi. Accompanied by two fresh garlic butter naans.',
      prepTime: '20 mins',
      isVeg: false
    },
    {
      id: 'sp-3',
      name: 'Royal Shahi Paneer Butter Masala',
      originalPrice: 429,
      price: 379,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
      chefNotes: 'Cottage cheese cubes bathed in a creamy cashew and tomato reduction, infused with cardamoms and garnished with silver leaf.',
      prepTime: '18 mins',
      isVeg: true
    },
    {
      id: 'sp-4',
      name: 'Truffle Wild Mushroom Pizza',
      originalPrice: 649,
      price: 549,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      chefNotes: 'Neapolitan sourdough pie topped with wild forest mushrooms, fior di latte mozzarella, black truffle drizzle & micro herbs.',
      prepTime: '15 mins',
      isVeg: true
    }
  ];

  const handleOrderSpecial = async (special) => {
    const itemObj = {
      _id: special.id,
      name: special.name,
      price: special.price,
      image: special.image,
      isVeg: special.isVeg
    };

    const res = await addToCart(itemObj, 1, 'Chef Special Edition');
    if (res.success) {
      setToastMessage(`Added "${special.name}" to cart!`);
      setTimeout(() => setToastMessage(''), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 rounded-2xl bg-amber-500 text-slate-950 px-5 py-3 font-extrabold shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce text-xs">
          <Check className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-400 border border-amber-500/30 uppercase tracking-widest">
            <ChefHat className="w-4 h-4" /> Limited Edition Culinary Curations
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white">
            Chef&apos;s Signature Offers & Specials
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Exclusive dishes designed and prepared by our Executive Chef Marcus Sterling.
          </p>
        </div>

        {/* Specials Cards */}
        <div className="space-y-8">
          {specials.map((spec) => (
            <div
              key={spec.id}
              className="rounded-3xl bg-gray-900/70 border border-gray-800 p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-center justify-between shadow-2xl hover:border-amber-500/40 transition-all duration-300 group"
            >
              {/* Dish Image */}
              <div className="w-full lg:w-96 h-64 shrink-0 rounded-2xl overflow-hidden border border-gray-800 relative bg-gray-950">
                <img
                  src={spec.image}
                  alt={spec.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gray-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {spec.rating}
                </span>
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                  spec.isVeg ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  {spec.isVeg ? 'Veg Special' : 'Non-Veg Special'}
                </span>
              </div>

              {/* Dish Content */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-400">Chef Recommendation</span>
                    <h2 className="text-2xl font-serif font-extrabold text-white group-hover:text-amber-400 transition-colors">
                      {spec.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 line-through font-mono block">₹{spec.originalPrice}</span>
                    <span className="text-2xl font-extrabold text-amber-400 font-mono">₹{spec.price}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light bg-gray-950/60 p-4 rounded-2xl border border-gray-800/80">
                  ⚡ &ldquo;{spec.chefNotes}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                    <CookingPot className="w-4 h-4 text-amber-400" /> Est. Cooking Time: {spec.prepTime}
                  </span>

                  <button
                    onClick={() => handleOrderSpecial(spec)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Special To Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Specials;
