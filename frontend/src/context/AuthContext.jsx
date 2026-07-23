import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const MOCK_USERS = {
  admin: {
    _id: 'mock-admin-id',
    name: 'Restaurant Admin',
    email: 'admin@foodapp.com',
    role: 'admin',
    phone: '+1 800-555-0199'
  },
  delivery: {
    _id: 'mock-driver-id',
    name: 'Speedy Delivery',
    email: 'driver@foodapp.com',
    role: 'delivery',
    phone: '+1 987-654-3210'
  },
  customer: {
    _id: 'mock-customer-id',
    name: 'Alice Customer',
    email: 'customer@foodapp.com',
    role: 'customer',
    phone: '+1 555-123-4567',
    addresses: [
      {
        _id: 'addr-1',
        label: 'Home',
        street: '123 Main St, Penthouse 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        isDefault: true
      }
    ]
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount or restore local mock user
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      const mockRole = localStorage.getItem('mockRole');

      if (mockRole && MOCK_USERS[mockRole]) {
        setUser(MOCK_USERS[mockRole]);
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.warn('Backend API connection offline, checking cached demo role:', error.message);
        // Fallback default customer profile for demo if token exists but backend offline
        setUser(MOCK_USERS.customer);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // Instant role switch for demo presentations
  const switchRole = (role) => {
    const targetUser = MOCK_USERS[role] || MOCK_USERS.customer;
    localStorage.setItem('mockRole', role);
    localStorage.setItem('token', `demo-token-${role}`);
    setUser(targetUser);
  };

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.removeItem('mockRole');
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        return { success: true };
      }
    } catch (error) {
      console.warn('Backend login failed, using demo account fallback if email matches:', email);
      
      // Fallback matching for original demo credentials if database offline
      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes('admin')) {
        switchRole('admin');
        return { success: true, message: 'Logged in as Admin (Demo Mode)' };
      } else if (lowerEmail.includes('driver')) {
        switchRole('delivery');
        return { success: true, message: 'Logged in as Delivery Driver (Demo Mode)' };
      } else if (lowerEmail.includes('customer') || lowerEmail.length > 0) {
        switchRole('customer');
        return { success: true, message: 'Logged in as Customer (Demo Mode)' };
      }

      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, password, role = 'customer', phone = '') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role, phone });
      if (response.data.success) {
        localStorage.removeItem('mockRole');
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        return { success: true };
      }
    } catch (error) {
      console.warn('Backend register failed, creating demo local account');
      const newUser = {
        _id: `user-${Date.now()}`,
        name: name || 'Demo User',
        email,
        role,
        phone
      };
      localStorage.setItem('mockRole', role);
      localStorage.setItem('token', `demo-token-${role}`);
      setUser(newUser);
      return { success: true, message: 'Registered in Demo Mode' };
    }
  };

  // Update profile handler (e.g. addresses, name, phone)
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        setUser((prev) => ({ ...prev, ...response.data }));
        return { success: true };
      }
    } catch (error) {
      setUser((prev) => ({ ...prev, ...profileData }));
      return { success: true, message: 'Profile updated locally' };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Backend logout failed/ignored:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('mockRole');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

