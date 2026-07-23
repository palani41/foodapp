import Stripe from 'stripe';
import Order from '../models/Order.js';

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// @desc    Create checkout session (Stripe or Mock)
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to pay for this order');
    }

    // Check if Stripe is configured
    if (stripe) {
      // Build line items for Stripe
      const lineItems = order.items.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name
          },
          unit_amount: Math.round(item.price * 100) // Stripe expects cents
        },
        quantity: item.quantity
      }));

      // Add tax & delivery line items if applicable
      if (order.tax > 0) {
        lineItems.push({
          price_data: {
            currency: 'inr',
            product_data: { name: 'Tax (10%)' },
            unit_amount: Math.round(order.tax * 100)
          },
          quantity: 1
        });
      }

      if (order.deliveryFee > 0) {
        lineItems.push({
          price_data: {
            currency: 'inr',
            product_data: { name: 'Delivery Fee' },
            unit_amount: Math.round(order.deliveryFee * 100)
          },
          quantity: 1
        });
      }

      // Handle discount via Stripe coupons is complex, so we can subtract coupon value or add a negative line item
      if (order.discount > 0) {
        lineItems.push({
          price_data: {
            currency: 'inr',
            product_data: { name: 'Applied Coupon Discount' },
            unit_amount: -Math.round(order.discount * 100)
          },
          quantity: 1
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/order-tracking/${order._id}`,
        client_reference_id: order._id.toString()
      });

      return res.json({
        success: true,
        mode: 'stripe',
        id: session.id,
        url: session.url
      });
    } else {
      // Mock Stripe session
      return res.json({
        success: true,
        mode: 'mock',
        orderId: order._id,
        message: 'Stripe API not configured. Falling back to Mock Payment Mode.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm mock payment / update order payment status
// @route   POST /api/payments/confirm-mock-payment
// @access  Private
export const confirmMockPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to verify this payment');
    }

    // Set payment status to paid, order status to confirmed
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    // WebSocket notification: Notify customer and admin
    if (req.io) {
      req.io.to(order.user.toString()).emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus
      });
      req.io.to('admins').emit('orderStatusChanged', {
        orderId: order._id,
        status: order.status
      });
    }

    res.json({
      success: true,
      message: 'Mock payment processed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook (for production stripe triggers)
// @route   POST /api/payments/webhook
// @access  Public
export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (!stripe || !sig) {
      return res.status(400).send('Webhook configuration missing or invalid signature');
    }

    event = stripe.webhooks.constructEvent(
      req.body, // Must be raw buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.client_reference_id;

    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();
        console.log(`Order ${orderId} successfully paid via Stripe Webhook.`);
        
        // Notify clients if req.io is active
        // Note: global io might be needed since webhook is async. In server.js we will export/expose io if needed, or simply let the database write trigger updates
      }
    } catch (dbError) {
      console.error(`Database update failed for order ${orderId}: ${dbError.message}`);
    }
  }

  res.json({ received: true });
};
