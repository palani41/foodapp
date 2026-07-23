import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Trash2, Home, CheckCircle2, Shield, Plus, Check } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Alice Customer',
    phone: user?.phone || '+1 (555) 123-4567'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Address add state
  const [newAddr, setNewAddr] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    const res = await updateProfile(profileData);
    setLoading(false);
    if (res.success) {
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.message);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    const addresses = user?.addresses ? [...user.addresses] : [];
    if (newAddr.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }
    addresses.push(newAddr);

    setLoading(true);
    const res = await updateProfile({ addresses });
    setLoading(false);
    
    if (res.success) {
      setNewAddr({ label: 'Home', street: '', city: '', state: '', zipCode: '', isDefault: false });
      setShowAddressForm(false);
      setSuccess('Address added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.message);
    }
  };

  const handleDeleteAddress = async (indexToDelete) => {
    setSuccess('');
    setError('');
    
    const addresses = (user?.addresses || []).filter((_, idx) => idx !== indexToDelete);
    
    setLoading(true);
    const res = await updateProfile({ addresses });
    setLoading(false);
    
    if (res.success) {
      setSuccess('Address removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(res.message);
    }
  };

  const addresses = user?.addresses || [
    {
      label: 'Home',
      street: '742 Evergreen Terrace, Penthouse 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 font-sans pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-gray-800 pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
              <User className="w-4 h-4" /> Guest Profile & Preferences
            </div>
            <h1 className="text-3xl font-serif font-extrabold text-white">
              Account Details
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs uppercase font-mono">
            {user?.role || 'Customer'}
          </span>
        </div>

        {/* Notification Toast */}
        {success && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold flex items-center gap-2">
            <Check className="w-4 h-4" /> {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Personal Info Form */}
          <div className="md:col-span-6 rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-serif font-bold text-white border-b border-gray-800 pb-3">Personal Information</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'customer@foodapp.com'}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-gray-500 opacity-70 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Column 2: Saved Delivery Addresses */}
          <div className="md:col-span-6 rounded-3xl bg-gray-900/80 border border-gray-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-base font-serif font-bold text-white">Delivery Addresses</h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs text-amber-400 font-bold hover:underline cursor-pointer"
              >
                {showAddressForm ? 'Cancel' : '+ Add Address'}
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="space-y-3 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <input
                  type="text"
                  placeholder="Street Address (e.g. 742 Evergreen Terrace)"
                  required
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={newAddr.zipCode}
                    onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                    className="rounded-xl border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
                >
                  Save Address
                </button>
              </form>
            )}

            <div className="space-y-3">
              {addresses.map((addr, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-950 border border-gray-850 space-y-1 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-amber-400" /> {addr.label || 'Home'}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                  <button
                    onClick={() => handleDeleteAddress(idx)}
                    className="text-gray-500 hover:text-red-400 absolute top-3 right-3 p-1 cursor-pointer"
                    title="Remove Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
