import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const MOCK_COUPONS = {
  SAVER20: { code: 'SAVER20', discountType: 'percentage', discountValue: 20, minOrderValue: 200 },
  WELCOME50: { code: 'WELCOME50', discountType: 'flat', discountValue: 100, minOrderValue: 300 }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null); // { code, discountType, discountValue, minOrderValue }
  const [orderType, setOrderType] = useState('delivery'); // 'delivery', 'takeaway', 'dine-in'
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [tableNumber, setTableNumber] = useState('');
  const { user } = useAuth();

  // Load cart from DB or local storage when user status changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart({ items: [] });
        setCoupon(null);
        return;
      }

      // Try local storage restore first for smooth demo experience
      const savedCart = localStorage.getItem(`cart_${user._id || user.email}`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.warn('Failed to parse cached cart:', e);
        }
      }

      setLoading(true);
      try {
        const response = await api.get('/cart');
        if (response.data.success && response.data.data) {
          setCart(response.data.data);
        }
      } catch (error) {
        console.warn('Backend cart fetch offline, relying on client local cart state');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Persist cart updates locally
  useEffect(() => {
    if (user && cart) {
      localStorage.setItem(`cart_${user._id || user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Set default address when user profile is loaded
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    } else {
      setSelectedAddress({
        street: '742 Evergreen Terrace',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        isDefault: true
      });
    }
  }, [user]);

  // Calculate pricing values
  const getSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.menuItem?.price || item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getTax = () => {
    return Math.round((getSubtotal() * 0.1) * 100) / 100;
  };

  const getDeliveryFee = () => {
    return orderType === 'delivery' ? 49 : 0;
  };

  const getDiscount = () => {
    if (!coupon) return 0;
    const subtotal = getSubtotal();
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) return 0;

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * (coupon.discountValue / 100)) * 100) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }
    return discountAmount > subtotal ? subtotal : discountAmount;
  };

  const getTotal = () => {
    const total = getSubtotal() + getTax() + getDeliveryFee() - getDiscount();
    return Math.max(0, Math.round(total * 100) / 100);
  };

  // Helper to add or update item locally
  const addToCartLocally = (itemOrId, quantity = 1, specialInstructions = '') => {
    setCart((prevCart) => {
      const existingItems = prevCart?.items ? [...prevCart.items] : [];
      let itemObj = typeof itemOrId === 'object' ? itemOrId : { _id: itemOrId, name: 'Delicious Dish', price: 299 };
      
      const itemIndex = existingItems.findIndex(
        (i) => (i.menuItem?._id || i.menuItem || i._id) === (itemObj._id || itemOrId)
      );

      if (itemIndex > -1) {
        existingItems[itemIndex] = {
          ...existingItems[itemIndex],
          quantity: existingItems[itemIndex].quantity + quantity,
          specialInstructions: specialInstructions || existingItems[itemIndex].specialInstructions
        };
      } else {
        existingItems.push({
          _id: `cart-item-${Date.now()}`,
          menuItem: itemObj,
          price: itemObj.price || 299,
          quantity,
          specialInstructions
        });
      }
      return { ...prevCart, items: existingItems };
    });
  };

  // Add item to cart
  const addToCart = async (menuItem, quantity = 1, specialInstructions = '') => {
    if (!user) return { success: false, message: 'Please log in to add items to cart' };
    
    const menuItemId = typeof menuItem === 'object' ? menuItem._id : menuItem;

    try {
      const response = await api.post('/cart/add', {
        menuItem: menuItemId,
        quantity,
        specialInstructions
      });
      if (response.data.success) {
        setCart(response.data.data);
        return { success: true };
      }
    } catch (error) {
      console.warn('Backend cart add failed, using client-side cart addition:', error.message);
      addToCartLocally(menuItem, quantity, specialInstructions);
      return { success: true, message: 'Added to cart (Demo Mode)' };
    }
  };

  // Update item quantity or preparation notes
  const updateCartItem = async (menuItemId, quantity, specialInstructions) => {
    if (!user) return;
    
    setCart((prevCart) => {
      const existingItems = prevCart?.items ? [...prevCart.items] : [];
      const index = existingItems.findIndex(
        (i) => (i.menuItem?._id || i.menuItem || i._id) === menuItemId || i._id === menuItemId
      );

      if (index > -1) {
        if (quantity <= 0) {
          existingItems.splice(index, 1);
        } else {
          existingItems[index] = {
            ...existingItems[index],
            quantity,
            specialInstructions: specialInstructions !== undefined ? specialInstructions : existingItems[index].specialInstructions
          };
        }
      }
      return { ...prevCart, items: existingItems };
    });

    try {
      await api.put('/cart/update', { menuItem: menuItemId, quantity, specialInstructions });
    } catch (error) {
      console.warn('Backend cart update failed, updated locally');
    }
  };

  // Remove item from cart
  const removeFromCart = async (menuItemId) => {
    if (!user) return;

    setCart((prevCart) => ({
      ...prevCart,
      items: (prevCart?.items || []).filter(
        (i) => (i.menuItem?._id || i.menuItem || i._id) !== menuItemId && i._id !== menuItemId
      )
    }));

    try {
      await api.delete(`/cart/remove/${menuItemId}`);
    } catch (error) {
      console.warn('Backend cart item removal failed, updated locally');
    }
  };

  // Apply a coupon code
  const applyCoupon = async (code) => {
    if (!user) return { success: false, message: 'Please log in to apply coupons' };
    const upperCode = code.trim().toUpperCase();

    try {
      const response = await api.post('/coupons/validate', {
        code: upperCode,
        subtotal: getSubtotal()
      });
      if (response.data.success) {
        setCoupon(response.data.data);
        return { success: true, message: 'Coupon applied successfully!' };
      }
    } catch (error) {
      if (MOCK_COUPONS[upperCode]) {
        const c = MOCK_COUPONS[upperCode];
        if (getSubtotal() < c.minOrderValue) {
          return { success: false, message: `Minimum order value for ${upperCode} is ₹${c.minOrderValue}` };
        }
        setCoupon(c);
        return { success: true, message: `Coupon ${upperCode} applied! Saved discount.` };
      }
      setCoupon(null);
      return { success: false, message: error.response?.data?.message || 'Invalid coupon code. Try SAVER20 or WELCOME50.' };
    }
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setCoupon(null);
  };

  // Clear local cart states
  const clearCart = () => {
    setCart({ items: [] });
    setCoupon(null);
    setTableNumber('');
    if (user) {
      localStorage.removeItem(`cart_${user._id || user.email}`);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        coupon,
        orderType,
        selectedAddress,
        tableNumber,
        setOrderType,
        setSelectedAddress,
        setTableNumber,
        getSubtotal,
        getTax,
        getDeliveryFee,
        getDiscount,
        getTotal,
        addToCart,
        updateCartItem,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

