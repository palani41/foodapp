import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Search, Plus, Flame, Clock, MapPin, Phone, Mail, ChevronRight, Star, Pizza, Beef, IceCream, Salad, Soup, Coffee, Sparkles, ArrowRight, ShieldCheck, Check, ShoppingCart, Utensils
} from 'lucide-react';

const Stars = ({ rating = 5, size = 13 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        width={size}
        height={size}
        style={{ color: '#FFB800', fill: i < Math.round(rating) ? '#FFB800' : 'none' }}
      />
    ))}
  </div>
);

function useCountdown(hours, minutes, seconds) {
  const [remaining, setRemaining] = useState(hours * 3600 + minutes * 60 + seconds);
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : hours * 3600 + minutes * 60 + seconds));
    }, 1000);
    return () => clearInterval(id);
  }, [hours, minutes, seconds]);
  const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  return { h, m, s };
}

const CATEGORIES = [
  { name: 'Appetizers', icon: Utensils, count: '12 Items' },
  { name: 'Pizza', icon: Pizza, count: '16 Items' },
  { name: 'Burgers', icon: Beef, count: '10 Items' },
  { name: 'Salads', icon: Salad, count: '8 Items' },
  { name: 'Soups', icon: Soup, count: '6 Items' },
  { name: 'Desserts', icon: IceCream, count: '14 Items' },
  { name: 'Beverages', icon: Coffee, count: '18 Items' },
];

const POPULAR_DISHES = [
  {
    _id: 'pop-1',
    name: 'Hyderabadi Dum Biryani',
    price: 399,
    rating: 4.9,
    prepTime: '25 min',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=600&q=80',
    description: 'Aromatic basmati rice cooked with tender marinated chicken and rare saffron spices.'
  },
  {
    _id: 'pop-2',
    name: 'Truffle Mushroom Pizza',
    price: 549,
    rating: 4.9,
    prepTime: '20 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Artisanal wood-fired dough topped with wild mushrooms, white truffle oil & fior di latte.'
  },
  {
    _id: 'pop-3',
    name: 'Smoked Peri-Peri Burger',
    price: 329,
    rating: 4.8,
    prepTime: '15 min',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'Charred double beef patty with molten cheddar, peri-peri glaze & crispy onion rings.'
  },
  {
    _id: 'pop-4',
    name: 'Slow-Braised Short Ribs',
    price: 699,
    rating: 5.0,
    prepTime: '30 min',
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: '12-hour braised prime short ribs served with garlic truffle mash & red wine jus.'
  },
  {
    _id: 'pop-5',
    name: 'Roasted Beet & Feta Salad',
    price: 289,
    rating: 4.7,
    prepTime: '12 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    description: 'Organic baby greens, heirloom roasted beets, crumbled French feta & candied walnuts.'
  },
  {
    _id: 'pop-6',
    name: 'Saffron Pistachio Kulfi',
    price: 199,
    rating: 4.9,
    prepTime: '10 min',
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional slow-boiled milk ice cream infused with Kashmiri saffron & roasted pistachios.'
  }
];

const REVIEWS = [
  {
    quote: "The presentation and packaging are beyond anything I've experienced. Arrived hot and tasting Michelin-grade!",
    author: 'Eleanor Vance',
    role: 'Food & Wine Critic',
    avatar: 'https://i.pravatar.cc/80?img=32',
    rating: 5
  },
  {
    quote: "The live order tracking stepper is completely interactive. It made hosting our client dinner effortless.",
    author: 'Marcus Sterling',
    role: 'Verified Corporate Client',
    avatar: 'https://i.pravatar.cc/80?img=51',
    rating: 5
  },
  {
    quote: "Hands down the best Truffle Pizza and Biryani in the city. Delivery driver arrived in under 25 mins.",
    author: 'Sophia Chen',
    role: 'Weekly Regular',
    avatar: 'https://i.pravatar.cc/80?img=47',
    rating: 5
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { h, m, s } = useCountdown(3, 45, 20);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedNotice, setAddedNotice] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickAdd = async (item) => {
    const res = await addToCart(item, 1);
    if (res.success) {
      setAddedNotice(item.name);
      setTimeout(() => setAddedNotice(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans overflow-x-hidden pt-16">
      
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-20 right-6 z-50 rounded-2xl bg-amber-500 text-slate-950 px-5 py-3 font-extrabold shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce">
          <Check className="w-5 h-5" /> Added &ldquo;{addedNotice}&rdquo; to your cart!
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Culinary Perfection Delivered
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-serif text-white tracking-tight leading-tight">
              Artisanal Gastronomy, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                Plated to Perfection.
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed font-light mx-auto lg:mx-0">
              Experience master chef creations crafted with hand-picked organic ingredients, delivered with precision to your doorstep or private dining lounge.
            </p>

            {/* Interactive Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 flex items-center bg-gray-900/90 border border-gray-800 p-2 rounded-2xl shadow-2xl focus-within:border-amber-500/60 transition-all">
              <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search dishes (e.g. Biryani, Truffle Pizza, Burgers)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
              >
                Explore Menu
              </button>
            </form>

            {/* Key Value Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> 30-Min Express Delivery
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> 100% Organic & Fresh
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9 Star Rating
              </span>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="Signature Dish"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
              
              {/* Floating Badge overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-gray-950/85 backdrop-blur-md border border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Chef Special</span>
                  <h3 className="text-sm font-extrabold text-white">Charred Herb Lamb Ribs</h3>
                  <p className="text-xs text-gray-400">₹699 • Saffron Butter Glaze</p>
                </div>
                <button
                  onClick={() => handleQuickAdd(POPULAR_DISHES[3])}
                  className="p-3 rounded-xl bg-amber-500 text-slate-950 font-extrabold hover:bg-amber-400 transition-colors shadow-lg cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CATEGORIES PILLS ================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-gray-900 bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase font-mono font-bold text-amber-400 tracking-widest">Explore Categories</span>
              <h2 className="text-2xl font-serif font-extrabold text-white">Curated Specialties</h2>
            </div>
            <Link to="/menu" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
              View All Categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => navigate(`/menu?category=${encodeURIComponent(cat.name)}`)}
                  className="rounded-2xl bg-gray-900/60 border border-gray-800 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:border-amber-500/50 hover:bg-gray-900 hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{cat.name}</h3>
                  <span className="text-[10px] text-gray-500 mt-0.5">{cat.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DEAL OF THE DAY COUNTDOWN BANNER ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900 border border-amber-500/30 p-8 sm:p-12 relative overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-extrabold uppercase">
              <Flame className="w-3.5 h-3.5 fill-red-400" /> Flash Offer — 30% Discount
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
              Chef&apos;s Signature Gourmet Feast
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed">
              Order our limited-edition Gourmet Sampler featuring Tandoori Lobster, Charcoal Biryani & Saffron Kulfi before the flash deal timer expires!
            </p>

            {/* Countdown timer blocks */}
            <div className="flex items-center gap-3 pt-2">
              {[['Hours', h], ['Minutes', m], ['Seconds', s]].map(([label, val]) => (
                <div key={label} className="rounded-2xl bg-gray-950 border border-gray-800 px-4 py-2.5 text-center min-w-[70px]">
                  <span className="font-mono text-xl font-extrabold text-amber-400">{val}</span>
                  <span className="block text-[9px] font-semibold text-gray-500 uppercase">{label}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-3.5 text-xs font-extrabold text-slate-950 hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
              >
                <span>Claim Offer Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
              alt="Gourmet Feast"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* ================= POPULAR DISHES GRID ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono font-bold text-amber-400 tracking-widest">Handpicked Favorites</span>
          <h2 className="text-3xl font-serif font-extrabold text-white mt-1">Trending Gourmet Dishes</h2>
          <p className="text-xs text-gray-400 mt-2">
            Explore our guests&apos; most ordered dishes cooked with precision and fresh artisanal ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {POPULAR_DISHES.map((dish) => (
            <div
              key={dish._id}
              className="group rounded-3xl bg-gray-900/60 border border-gray-800/80 overflow-hidden flex flex-col transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden bg-gray-950">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-400" /> {dish.rating}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-950/80 backdrop-blur-md text-[10px] font-bold text-gray-300 border border-gray-800">
                  <Clock className="w-3 h-3 text-amber-400" /> {dish.prepTime}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                      {dish.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider ${dish.isVeg ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}">
                      {dish.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500">Price</span>
                    <span className="text-lg font-extrabold text-amber-400 font-mono">₹{dish.price}</span>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(dish)}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add to Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= REVIEWS SECTION ================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950/80 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase font-mono font-bold text-amber-400 tracking-widest">Client Reviews</span>
            <h2 className="text-3xl font-serif font-extrabold text-white mt-1">What Our Guests Savor</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, idx) => (
              <div key={idx} className="rounded-3xl bg-gray-900/50 border border-gray-800 p-6 flex flex-col justify-between space-y-4">
                <Stars rating={r.rating} size={15} />
                <p className="text-xs text-gray-300 leading-relaxed italic">&ldquo;{r.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                  <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full object-cover border border-amber-500/30" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{r.author}</h4>
                    <span className="text-[10px] text-amber-400">{r.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-950 border-t border-gray-900 pt-16 pb-8 text-gray-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-900">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="font-serif font-extrabold text-xl text-white">GourmetHaven</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Serving handcrafted luxury cuisine, fine dining meals, and lightning-fast home deliveries with real-time order tracking.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-3">Explore Menu</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/menu" className="hover:text-amber-400">Artisanal Pizzas</Link></li>
              <li><Link to="/menu" className="hover:text-amber-400">Dum Biryanis</Link></li>
              <li><Link to="/menu" className="hover:text-amber-400">Chef Specials</Link></li>
              <li><Link to="/menu" className="hover:text-amber-400">Desserts & Shakes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-3">Client Portal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/login" className="hover:text-amber-400">Original Logins Showcase</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400">Admin Dashboard</Link></li>
              <li><Link to="/delivery" className="hover:text-amber-400">Delivery Driver Portal</Link></li>
              <li><Link to="/my-orders" className="hover:text-amber-400">Live Order Stepper</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-3">Restaurant HQ</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> 452 Culinary Blvd, New York, NY</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400" /> +1 (800) 555-0199</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400" /> concierge@gourmethaven.com</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Gourmet Haven. All Rights Reserved. Prepared for Client Demo.</p>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;