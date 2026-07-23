import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';

// Router Protections
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Layout & Global Components
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Specials from './pages/Specials';
import Menu from './pages/Menu';

const App = () => {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SocketProvider>
            <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
              
              {/* Floating Dock Navbar */}
              <Navbar onCartToggle={() => setCartDrawerOpen(true)} />

              {/* Shopping Cart Drawer slide-out */}
              <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

              {/* Main Content Area */}
              <main className="flex-1">
                <Routes>
                   {/* Public routes */}
                   <Route path="/" element={<Home />} />
                   <Route path="/menu" element={<Menu />} />
                   <Route path="/about" element={<About />} />
                   <Route path="/contact" element={<Contact />} />
                   <Route path="/specials" element={<Specials />} />

                   <Route path="/login" element={<Login />} />

                  {/* Customer protected routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-success"
                    element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-tracking/:id"
                    element={
                      <ProtectedRoute>
                        <OrderTracking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin dashboard (Admin role only) */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <RoleRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </RoleRoute>
                      </ProtectedRoute>
                    }
                  />

                  {/* Delivery staff (Delivery & Admin roles) */}
                  <Route
                    path="/delivery"
                    element={
                      <ProtectedRoute>
                        <RoleRoute allowedRoles={['delivery', 'admin']}>
                          <DeliveryDashboard />
                        </RoleRoute>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>

            </div>
          </SocketProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

