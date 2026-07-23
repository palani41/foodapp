import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Shield, Truck, Menu, X, UtensilsCrossed, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/specials', label: 'Offers & Specials' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = ({ onCartToggle }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);

  const linkTrackRef = useRef(null);
  const linkRefs = useRef([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const cartQuantity = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const prevQty = useRef(cartQuantity);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // bounce the cart icon whenever the quantity goes up
  useEffect(() => {
    if (cartQuantity > prevQty.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 420);
      return () => clearTimeout(t);
    }
    prevQty.current = cartQuantity;
  }, [cartQuantity]);

  const moveIndicatorTo = (el) => {
    if (!el || !linkTrackRef.current) return;
    const trackRect = linkTrackRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({ left: elRect.left - trackRect.left, width: elRect.width, opacity: 1 });
  };

  const restIndicator = () => {
    const activeIdx = NAV_LINKS.findIndex((l) => l.to === location.pathname);
    if (activeIdx >= 0 && linkRefs.current[activeIdx]) {
      moveIndicatorTo(linkRefs.current[activeIdx]);
    } else {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    restIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className="mx-auto max-w-6xl rounded-full transition-all duration-300 border font-sans"
        style={{
          background: scrolled ? 'rgba(11, 15, 23, 0.92)' : 'rgba(15, 23, 42, 0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: scrolled ? 'rgba(255, 184, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
          boxShadow: scrolled
            ? '0 16px 36px -12px rgba(0, 0, 0, 0.6), 0 0 20px 0 rgba(255, 184, 0, 0.15)'
            : '0 8px 24px -10px rgba(0, 0, 0, 0.4)',
          paddingTop: scrolled ? 10 : 14,
          paddingBottom: scrolled ? 10 : 14,
        }}
      >
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-2 z-50 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-extrabold text-lg sm:text-xl text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                Gourmet<span className="text-amber-400">Haven</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-amber-400/80 font-bold font-sans">
                Fine Dining & Delivery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation links */}
          <div
            ref={linkTrackRef}
            onMouseLeave={restIndicator}
            className="relative hidden md:flex items-center gap-1 bg-gray-900/40 p-1 rounded-full border border-gray-800/60"
          >
            <span
              className="absolute top-1/2 h-8 -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.opacity,
                background: 'linear-gradient(135deg, rgba(255,184,0,0.22), rgba(255,184,0,0.10))',
                border: '1px solid rgba(255,184,0,0.4)',
              }}
            />
            {NAV_LINKS.map((l, i) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  ref={(el) => (linkRefs.current[i] = el)}
                  onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 z-10"
                  style={{ color: active ? '#FFB800' : '#D1D5DB' }}
                >
                  {l.label}
                </Link>
              );
            })}
            {user && user.role === 'customer' && (
              <Link
                to="/my-orders"
                ref={(el) => (linkRefs.current[NAV_LINKS.length] = el)}
                onMouseEnter={(e) => moveIndicatorTo(e.currentTarget)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 z-10"
                style={{ color: location.pathname === '/my-orders' ? '#FFB800' : '#D1D5DB' }}
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Right Action Tools: Role Badges + Cart + Profile */}
          <div className="flex items-center gap-3">
            
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-md shadow-amber-500/10"
              >
                <Shield className="h-3.5 w-3.5" /> Admin Console
              </Link>
            )}
            
            {user && user.role === 'delivery' && (
              <Link
                to="/delivery"
                className="hidden lg:flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all shadow-md shadow-cyan-500/10"
              >
                <Truck className="h-3.5 w-3.5" /> Delivery Driver
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onCartToggle}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 border border-gray-800 text-gray-200 hover:text-amber-400 hover:border-amber-500/50 transition-all cursor-pointer shadow-inner"
              aria-label="Toggle Shopping Cart"
            >
              <ShoppingCart className={`h-4 w-4 ${bump ? 'scale-125 text-amber-400 transition-transform' : ''}`} />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold text-slate-950 shadow-md">
                  {cartQuantity}
                </span>
              )}
            </button>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full p-1 pr-3 bg-gray-900 border border-gray-800 hover:border-amber-500/40 transition-all cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-sm">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-100 leading-tight">{user.name}</span>
                    <span className="text-[9px] uppercase font-mono text-amber-400 font-semibold leading-tight">{user.role}</span>
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-gray-950 p-2 z-50 border border-gray-800 shadow-2xl">
                    <div className="px-3 py-2 border-b border-gray-800">
                      <p className="text-[10px] font-semibold text-gray-400">Signed in as</p>
                      <p className="truncate text-xs font-bold text-amber-400">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-left mt-1 cursor-pointer transition-colors text-gray-300 hover:bg-gray-900 hover:text-white"
                    >
                      <User className="h-3.5 w-3.5 text-gray-400" /> Account Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-left mt-1 cursor-pointer transition-colors text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-3.5 w-3.5 text-red-400" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 transition-all shadow-md shadow-amber-500/20"
              >
                <User className="h-3.5 w-3.5" /> Client Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 border border-gray-800 text-gray-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mx-auto mt-2 max-w-6xl rounded-3xl p-4 bg-gray-950/95 backdrop-blur-xl border border-gray-800 shadow-2xl space-y-2">
          {NAV_LINKS.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-300 hover:bg-gray-900'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          {user && user.role === 'customer' && (
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-900"
            >
              My Orders
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30"
            >
              <Shield className="h-4 w-4" /> Admin Console
            </Link>
          )}
          {user && user.role === 'delivery' && (
            <Link
              to="/delivery"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
            >
              <Truck className="h-4 w-4" /> Delivery Console
            </Link>
          )}
          {!user && (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold bg-amber-500 text-slate-950 mt-2"
            >
              <User className="h-4 w-4" /> Sign In
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;