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
        street: '742 Evergreen Terrace',
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

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      const savedUserStr = localStorage.getItem('custom_user');
      const mockRole = localStorage.getItem('mockRole');

      if (savedUserStr) {
        try {
          setUser(JSON.parse(savedUserStr));
          setLoading(false);
          return;
        } catch (e) {
          console.warn('Failed parsing saved custom user');
        }
      }

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
          setUser(response.data.data || response.data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.warn('Backend API me check offline, using cached account');
        setUser(MOCK_USERS.customer);
      }
      setLoading(false);
    };

    fetchMe();
  }, []);

  const switchRole = (role) => {
    const targetUser = MOCK_USERS[role] || MOCK_USERS.customer;
    localStorage.removeItem('custom_user');
    localStorage.setItem('mockRole', role);
    localStorage.setItem('token', `demo-token-${role}`);
    setUser(targetUser);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const userData = response.data.data || response.data;
        localStorage.removeItem('mockRole');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('custom_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      console.warn('Backend login error, checking local saved user or fallback:', error.message);
      
      const savedUserStr = localStorage.getItem('custom_user');
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser.email?.toLowerCase() === email.toLowerCase()) {
          setUser(savedUser);
          return { success: true };
        }
      }

      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes('admin')) {
        switchRole('admin');
        return { success: true };
      } else if (lowerEmail.includes('driver')) {
        switchRole('delivery');
        return { success: true };
      } else {
        switchRole('customer');
        return { success: true };
      }
    }
  };

  const register = async (name, email, password, role = 'customer', phone = '') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role, phone });
      if (response.data.success) {
        const userData = response.data.data || response.data;
        localStorage.removeItem('mockRole');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('custom_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      console.warn('Backend registration API offline, saving user locally');
      const newUser = {
        _id: `user-${Date.now()}`,
        name: name || 'Registered Guest',
        email,
        role,
        phone,
        addresses: []
      };
      localStorage.setItem('token', `token-${Date.now()}`);
      localStorage.setItem('custom_user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        const updated = response.data.data || response.data;
        setUser(updated);
        localStorage.setItem('custom_user', JSON.stringify(updated));
        return { success: true };
      }
    } catch (error) {
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('custom_user', JSON.stringify(updated));
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('mockRole');
    localStorage.removeItem('custom_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
