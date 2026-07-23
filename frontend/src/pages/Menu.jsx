import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import { Search, Eye, Star, Plus, Minus, X, Check, Utensils, Sparkles } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const SAMPLE_MENU = [
  // South Indian Delicacies
  {
    _id: 'm-si-1',
    name: 'Crispy Masala Dosa & Sambar',
    price: 189,
    category: { name: 'South Indian' },
    isVeg: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    description: 'Golden thin rice crepe stuffed with spiced potato masala, served with piping hot vegetable sambar & fresh coconut chutney.',
    ingredients: ['Rice Flour', 'Urad Dal', 'Potatoes', 'Mustard Seeds', 'Coconut'],
    allergens: ['Mustard']
  },
  {
    _id: 'm-si-2',
    name: 'Madurai Chettinad Chicken Curry',
    price: 429,
    category: { name: 'South Indian' },
    isVeg: false,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
    description: 'Fiery Tamil Nadu Chettinad-style chicken curry cooked with freshly roasted star anise, fennel, black pepper & curry leaves.',
    ingredients: ['Chicken', 'Fennel Seeds', 'Star Anise', 'Black Pepper', 'Curry Leaves'],
    allergens: []
  },
  {
    _id: 'm-si-3',
    name: 'Ghee Roast Paneer Podi Dosa',
    price: 229,
    category: { name: 'South Indian' },
    isVeg: true,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    description: 'Crispy dosa roasted in rich desi ghee, dusted with spicy gun powder podi masala & filled with crumbled paneer.',
    ingredients: ['Ghee', 'Paneer', 'Spicy Podi', 'Rice Batter'],
    allergens: ['Dairy']
  },
  {
    _id: 'm-si-4',
    name: 'Fluffy Steamed Idli & Medu Vada Combo',
    price: 149,
    category: { name: 'South Indian' },
    isVeg: true,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    description: 'Soft steamed rice cakes & golden crispy lentil donuts served with peanut tomato chutney & sambar.',
    ingredients: ['Urad Dal', 'Rice', 'Ginger', 'Curry Leaves'],
    allergens: []
  },
  {
    _id: 'm-si-5',
    name: 'Kerala Malabar Parotta & Korma',
    price: 389,
    category: { name: 'South Indian' },
    isVeg: false,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    description: 'Flaky layered Kerala Malabar parottas served with aromatic coconut milk chicken korma.',
    ingredients: ['Maida', 'Coconut Milk', 'Chicken', 'Green Chilies'],
    allergens: ['Gluten', 'Dairy']
  },
  {
    _id: 'm-si-6',
    name: 'Authentic South Indian Filter Kaapi',
    price: 89,
    category: { name: 'Beverages' },
    isVeg: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    description: 'Frothed chicory coffee brewed in a brass filter, poured with hot boiled whole milk in a traditional davarah.',
    ingredients: ['Coffee Powder', 'Chicory', 'Milk', 'Sugar'],
    allergens: ['Dairy']
  },

  // North Indian & International Gourmet Favorites
  {
    _id: 'm-1',
    name: 'Hyderabadi Dum Chicken Biryani',
    price: 399,
    category: { name: 'Mains' },
    isVeg: false,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1559528896-c5310744cce8?auto=format&fit=crop&w=600&q=80',
    description: 'Slow-sealed dum biryani cooked with long-grain basmati rice, tender chicken, Kashmiri saffron & caramelized onions.',
    ingredients: ['Basmati Rice', 'Chicken', 'Saffron', 'Mint', 'Dum Masala'],
    allergens: ['Dairy']
  },
  {
    _id: 'm-2',
    name: 'Authentic Butter Chicken & Garlic Naan',
    price: 449,
    category: { name: 'Mains' },
    isVeg: false,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    description: 'Charcoal-grilled chicken tikka simmered in a velvety tomato butter gravy with kasuri methi & garlic naan.',
    ingredients: ['Chicken', 'Butter', 'Cream', 'Tomato Puree', 'Kasoori Methi'],
    allergens: ['Dairy', 'Gluten']
  },
  {
    _id: 'm-3',
    name: 'Shahi Paneer Butter Masala',
    price: 379,
    category: { name: 'Mains' },
    isVeg: true,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    description: 'Cottage cheese cubes bathed in a creamy cashew and tomato reduction, topped with cardamom cream.',
    ingredients: ['Paneer', 'Cashew Paste', 'Butter', 'Tomato', 'Cream'],
    allergens: ['Dairy', 'Nuts']
  },
  {
    _id: 'm-4',
    name: 'Slow-Cooked Dal Makhani',
    price: 279,
    category: { name: 'Mains' },
    isVeg: true,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80',
    description: 'Black lentils and red kidney beans simmered overnight with white butter, cream & mild spices.',
    ingredients: ['Black Lentils', 'Butter', 'Cream', 'Spices'],
    allergens: ['Dairy']
  },
  {
    _id: 'm-5',
    name: 'Tandoori Paneer Tikka Skewers',
    price: 249,
    category: { name: 'Appetizers' },
    isVeg: true,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    description: 'Cubes of cottage cheese marinated in spiced yogurt and grilled over clay tandoor coals.',
    ingredients: ['Paneer', 'Yogurt', 'Bell Peppers', 'Tandoori Spices'],
    allergens: ['Dairy']
  },
  {
    _id: 'm-6',
    name: 'Deluxe Samosa Chaat',
    price: 189,
    category: { name: 'Appetizers' },
    isVeg: true,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    description: 'Crushed potato samosas smothered with spicy chickpea curry, sweetened yogurt, mint & tamarind chutneys.',
    ingredients: ['Potato Samosa', 'Chickpeas', 'Yogurt', 'Chutney'],
    allergens: ['Gluten', 'Dairy']
  },
  {
    _id: 'm-7',
    name: 'Crispy Truffle Garlic Bread',
    price: 229,
    category: { name: 'Appetizers' },
    isVeg: true,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&q=80',
    description: 'Toasted baguette slices drenched in roasted garlic herb butter & white truffle oil.',
    ingredients: ['Baguette', 'Garlic', 'Butter', 'Truffle Oil'],
    allergens: ['Gluten', 'Dairy']
  },
  {
    _id: 'm-8',
    name: 'Truffle Wild Mushroom Pizza',
    price: 549,
    category: { name: 'Pizza' },
    isVeg: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    description: 'Neapolitan sourdough crust with forest mushrooms, fior di latte mozzarella & black truffle glaze.',
    ingredients: ['Sourdough', 'Shiitake', 'Mozzarella', 'Truffle Oil'],
    allergens: ['Gluten', 'Dairy']
  },
  {
    _id: 'm-9',
    name: 'Classic Pepperoni Feast Pizza',
    price: 599,
    category: { name: 'Pizza' },
    isVeg: false,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    description: 'Double cured pepperoni slices with smoked paprika, San Marzano tomato sauce & oregano.',
    ingredients: ['Pepperoni', 'Tomato Sauce', 'Mozzarella'],
    allergens: ['Gluten', 'Dairy']
  },
  {
    _id: 'm-10',
    name: 'Charred Peri-Peri Beef Burger',
    price: 349,
    category: { name: 'Burgers' },
    isVeg: false,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    description: 'Prime Angus patty with melted sharp cheddar, caramelized onions & fiery peri-peri aioli.',
    ingredients: ['Angus Beef', 'Cheddar', 'Peri-Peri', 'Brioche Bun'],
    allergens: ['Gluten', 'Dairy']
  },
  {
    _id: 'm-11',
    name: 'Shahi Gulab Jamun with Rabri',
    price: 149,
    category: { name: 'Desserts' },
    isVeg: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1593701461250-d7b22dfd3a77?auto=format&fit=crop&w=600&q=80',
    description: 'Warm fried milk dumplings soaked in rose cardamom sugar syrup, served with thick rabri.',
    ingredients: ['Khoa', 'Sugar Syrup', 'Cardamom', 'Rabri'],
    allergens: ['Dairy', 'Gluten']
  },
  {
    _id: 'm-12',
    name: 'Kesari Rasmalai',
    price: 169,
    category: { name: 'Desserts' },
    isVeg: true,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    description: 'Soft cottage cheese discs soaked in saffron-infused milk, topped with silver leaf & pistachios.',
    ingredients: ['Cottage Cheese', 'Saffron Milk', 'Pistachios'],
    allergens: ['Dairy', 'Nuts']
  },
  {
    _id: 'm-13',
    name: 'Royal Alphonso Mango Lassi',
    price: 129,
    category: { name: 'Beverages' },
    isVeg: true,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571006682858-a458b8a69212?auto=format&fit=crop&w=600&q=80',
    description: 'Thick creamy yogurt shake blended with fresh Alphonso mango pulp & saffron cardamom dust.',
    ingredients: ['Mango Pulp', 'Yogurt', 'Cardamom'],
    allergens: ['Dairy']
  }
];

const CATEGORY_NAMES = ['All', 'South Indian', 'Mains', 'Appetizers', 'Pizza', 'Burgers', 'Desserts', 'Beverages'];

const Menu = () => {
  const location = useLocation();
  const { addToCart } = useCart();

  const [items, setItems] = useState(SAMPLE_MENU);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [vegFilter, setVegFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState(800);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [addedToast, setAddedToast] = useState('');

  // Read URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const q = params.get('search');
    if (cat) setSelectedCategory(cat);
    if (q) setSearchTerm(q);

    const fetchMenuApi = async () => {
      setLoading(true);
      try {
        const res = await api.get('/menu');
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const validItems = res.data.data.filter(i => i.image && i.image.trim().length > 0);
          if (validItems.length > 0) {
            setItems(validItems);
          }
        }
      } catch (e) {
        console.warn('Backend menu fetch offline, using authentic South Indian & gourmet menu');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuApi();
  }, [location.search]);

  // Filter items
  const filteredItems = items.filter((item) => {
    const categoryMatch =
      selectedCategory === 'All' ||
      (item.category?.name || item.category) === selectedCategory;

    const searchMatch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    const vegMatch =
      vegFilter === 'all' ||
      (vegFilter === 'veg' && item.isVeg) ||
      (vegFilter === 'nonveg' && !item.isVeg);

    const priceMatch = (item.price || 0) <= maxPrice;

    return categoryMatch && searchMatch && vegMatch && priceMatch;
  });

  const handleAddToCart = async (item, customQty = 1, customNotes = '') => {
    const res = await addToCart(item, customQty, customNotes);
    if (res.success) {
      setAddedToast(`Added "${item.name}" to cart`);
      setTimeout(() => setAddedToast(''), 2200);
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Added Toast */}
      {addedToast && (
        <div className="fixed bottom-20 right-6 z-50 rounded-2xl bg-amber-500 text-slate-950 px-5 py-3 font-extrabold shadow-2xl flex items-center gap-2 border border-amber-300 animate-bounce text-xs">
          <Check className="w-4 h-4" /> {addedToast}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-mono font-bold text-amber-400 tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Authentic South Indian & Gourmet Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white">
            Explore Our Gourmet Menu
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Handcrafted with organic ingredients, crisp ghee roast dosas, Chettinad curries & rare spices.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-3xl bg-gray-900/80 border border-gray-800 p-4 sm:p-6 space-y-4 shadow-xl">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Dosa, Biryani, Chettinad, Butter Chicken..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-2xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white text-xs cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg / Non-Veg Toggle Pills */}
            <div className="flex items-center gap-2 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
              <button
                onClick={() => setVegFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  vegFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-gray-400 hover:text-white'
                }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  vegFilter === 'veg' ? 'bg-emerald-500 text-slate-950' : 'text-gray-400 hover:text-emerald-400'
                }`}
              >
                🌱 Veg Only
              </button>
              <button
                onClick={() => setVegFilter('nonveg')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  vegFilter === 'nonveg' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                🍗 Non-Veg Only
              </button>
            </div>

            {/* Max Price Slider */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">Max Price: ₹{maxPrice}</span>
              <input
                type="range"
                min="80"
                max="800"
                step="20"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full md:w-32 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 border-t border-gray-800/80 no-scrollbar">
            {CATEGORY_NAMES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-md'
                    : 'bg-gray-950 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-gray-800 bg-gray-900/40 space-y-3">
            <Utensils className="w-12 h-12 text-gray-600 mx-auto animate-bounce" />
            <h3 className="text-xl font-serif font-bold text-gray-200">No dishes matched your filter</h3>
            <p className="text-xs text-gray-500">Try adjusting your search terms or clearing price filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
                setVegFilter('all');
                setMaxPrice(800);
              }}
              className="px-5 py-2.5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold cursor-pointer hover:bg-amber-400"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group rounded-3xl bg-gray-900/60 border border-gray-800/80 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden bg-gray-950">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gray-950/80 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> {item.rating || 4.8}
                  </div>
                  <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    item.isVeg ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
                    <span className="text-lg font-extrabold text-amber-400 font-mono">₹{item.price}</span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-2 rounded-xl bg-gray-950 border border-gray-800 text-gray-400 hover:text-white hover:border-amber-500/30 transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(item, 1)}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-extrabold text-slate-950 hover:bg-amber-400 transition-all shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Dish Detail Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md">
          <div className="max-w-lg w-full rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl overflow-hidden text-gray-100 space-y-4">
            
            <div className="relative h-56 overflow-hidden">
              <img
                src={getImageUrl(selectedItem.image)}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-950/80 text-gray-300 hover:text-white cursor-pointer border border-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">{selectedItem.name}</h2>
                  <span className="text-xs text-amber-400 font-bold">Category: {selectedItem.category?.name || 'Gourmet'}</span>
                </div>
                <span className="text-xl font-extrabold text-amber-400 font-mono">₹{selectedItem.price}</span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">{selectedItem.description}</p>

              {selectedItem.ingredients && (
                <div className="text-xs">
                  <span className="font-bold text-gray-400 block mb-1">Key Ingredients:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.ingredients.map((ing) => (
                      <span key={ing} className="px-2.5 py-0.5 rounded-lg bg-gray-950 border border-gray-800 text-[10px] text-gray-300">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Preparation Preference</label>
                <input
                  type="text"
                  placeholder="e.g. Extra spicy, coconut chutney on side..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Quantity Controls & Add Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 rounded-2xl bg-gray-950 border border-gray-800 px-3 py-1.5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-white cursor-pointer">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-white px-2">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-white cursor-pointer">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(selectedItem, quantity, instructions)}
                  className="flex-1 ml-4 py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 transition-colors shadow-lg cursor-pointer"
                >
                  Add To Order (₹{selectedItem.price * quantity})
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Menu;
