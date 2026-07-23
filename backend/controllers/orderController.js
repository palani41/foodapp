import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import Table from '../models/Table.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, orderType, address, tableNumber, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items provided');
    }

    // 1. Calculate pricing details and verify items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        res.status(404);
        throw new Error(`Menu item not found: ${item.menuItem}`);
      }
      if (!menuItem.isAvailable) {
        res.status(400);
        throw new Error(`Menu item ${menuItem.name} is currently unavailable`);
      }

      const price = menuItem.price;
      subtotal += price * item.quantity;

      orderItems.push({
        menuItem: item.menuItem,
        name: menuItem.name,
        price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || ''
      });
    }

    // 2. Calculate tax (10%)
    const tax = Math.round((subtotal * 0.1) * 100) / 100;

    // 3. Calculate delivery fee (if delivery, flat ₹40; else $0)
    const deliveryFee = orderType === 'delivery' ? 40 : 0;

    // 4. Validate coupon discount if code exists
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        const now = new Date();
        if (now <= coupon.expiryDate && subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * (coupon.discountValue / 100)) * 100) / 100;
          } else {
            discount = coupon.discountValue;
          }
          if (discount > subtotal) discount = subtotal;
        }
      }
    }

    // 5. Total
    const total = Math.round((subtotal + tax + deliveryFee - discount) * 100) / 100;

    // 6. Check table validity if dine-in
    if (orderType === 'dine-in' && tableNumber) {
      const table = await Table.findOne({ tableNumber });
      if (table) {
        table.isReserved = true;
        await table.save();
      }
    }

    // 7. Create Order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      orderType,
      address: orderType === 'delivery' ? address : undefined,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending', // paid will trigger after Stripe or simulated payment
      subtotal,
      tax,
      deliveryFee,
      discount,
      total,
      status: 'pending',
      estimatedTime: 30
    });

    // 8. Clear Cart
    await Cart.findOneAndDelete({ user: req.user._id });

    // 9. WebSocket notification: Notify admins of new order
    if (req.io) {
      req.io.to('admins').emit('newOrder', {
        message: `New order placed by ${req.user.name}`,
        orderId: order._id,
        total: order.total
      });
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('deliveryStaff', 'name phone');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Authorization checks: Admin can view all. Delivery can view if assigned. Customer can view if it is theirs.
    const isAdmin = req.user.role === 'admin';
    const isDelivery = req.user.role === 'delivery' && order.deliveryStaff?.toString() === req.user._id.toString();
    const isCustomer = order.user._id.toString() === req.user._id.toString();

    if (!isAdmin && !isDelivery && !isCustomer) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin views all, Delivery views assigned or pending delivery orders)
// @route   GET /api/orders
// @access  Private (Admin / Delivery)
export const getOrders = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'delivery') {
      // Delivery staff can see orders assigned to them, OR delivery orders that are confirmed/preparing (so they can pick them up)
      query = {
        orderType: 'delivery',
        $or: [
          { deliveryStaff: req.user._id },
          { deliveryStaff: { $exists: false }, status: { $in: ['confirmed', 'preparing'] } }
        ]
      };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('deliveryStaff', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin / Delivery)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, estimatedTime } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Delivery staff can only transition delivery orders and cannot change to confirmed/preparing or update estimated time
    if (req.user.role === 'delivery') {
      if (order.orderType !== 'delivery') {
        res.status(403);
        throw new Error('Delivery staff can only update delivery orders');
      }
      if (order.deliveryStaff?.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('You are not assigned to this order');
      }
      // Allowed delivery transitions
      if (!['out-for-delivery', 'delivered'].includes(status)) {
        res.status(400);
        throw new Error('Delivery staff can only set status to Out for Delivery or Delivered');
      }
    }

    order.status = status || order.status;
    if (estimatedTime !== undefined) {
      order.estimatedTime = Number(estimatedTime);
    }

    // If order type is dine-in and marked as delivered/cancelled, free the table
    if (order.orderType === 'dine-in' && ['delivered', 'cancelled'].includes(status) && order.tableNumber) {
      const table = await Table.findOne({ tableNumber: order.tableNumber });
      if (table) {
        table.isReserved = false;
        table.currentOrderId = undefined;
        await table.save();
      }
    }

    await order.save();

    // WebSocket notification: Notify customer about order status update
    if (req.io) {
      req.io.to(order.user.toString()).emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.status,
        estimatedTime: order.estimatedTime
      });

      // Also notify admins/delivery of status change
      req.io.to('admins').emit('orderStatusChanged', { orderId: order._id, status: order.status });
      if (order.orderType === 'delivery' && order.deliveryStaff) {
        req.io.to(order.deliveryStaff.toString()).emit('orderStatusChanged', { orderId: order._id, status: order.status });
      }
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign delivery staff to order
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
export const assignDeliveryStaff = async (req, res, next) => {
  try {
    const { deliveryStaffId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.orderType !== 'delivery') {
      res.status(400);
      throw new Error('Cannot assign delivery staff to dine-in or takeaway orders');
    }

    order.deliveryStaff = deliveryStaffId || undefined;
    
    // Automatically transition to preparing/confirmed if assigned
    if (deliveryStaffId && order.status === 'pending') {
      order.status = 'confirmed';
    }

    await order.save();

    const updatedOrder = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('deliveryStaff', 'name phone');

    // WebSocket notifications
    if (req.io) {
      // Notify customer
      req.io.to(order.user.toString()).emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.status,
        deliveryStaff: updatedOrder.deliveryStaff
      });

      // Notify the assigned delivery staff member
      if (deliveryStaffId) {
        req.io.to(deliveryStaffId).emit('deliveryAssigned', {
          message: `New delivery order assigned: #${order._id}`,
          orderId: order._id
        });
      }
    }

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};
