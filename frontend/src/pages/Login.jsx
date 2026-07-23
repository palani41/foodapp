import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, KeyRound, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, user } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isRegister) {
      const res = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.phone
      );
      if (res.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          const redirectPath = formData.role === 'admin' ? '/admin' : formData.role === 'delivery' ? '/delivery' : '/';
          navigate(redirectPath);
        }, 1200);
      } else {
        setError(res.message);
      }
    } else {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          const redirectPath = location.state?.from?.pathname || '/';
          navigate(redirectPath);
        }, 1200);
      } else {
        setError(res.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-panel rounded-3xl p-8 sm:p-10 border border-gray-800 shadow-2xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-1.5 text-xs text-gray-400">
            {isRegister ? 'Enter your details to create a new user profile' : 'Sign in to access your orders and account'}
          </p>
        </div>

        {/* Form Alerts */}
        {error && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> {success}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-500 focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Account Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 px-3 text-sm text-gray-200 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="customer">Customer (Food Ordering)</option>
                  <option value="admin">Restaurant Admin / Manager</option>
                  <option value="delivery">Delivery Fleet Driver</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-300 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Form Link */}
        <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-800">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer ml-1"
          >
            {isRegister ? 'Sign In' : 'Register here'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
