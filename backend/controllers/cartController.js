import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.menuItem',
      select: 'name price image isVeg isAvailable'
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { menuItem, quantity, specialInstructions } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === menuItem
    );

    if (itemIndex > -1) {
      // Item exists, update quantity and instructions
      cart.items[itemIndex].quantity += Number(quantity || 1);
      if (specialInstructions !== undefined) {
        cart.items[itemIndex].specialInstructions = specialInstructions;
      }
    } else {
      // Add new item
      cart.items.push({
        menuItem,
        quantity: Number(quantity || 1),
        specialInstructions: specialInstructions || ''
      });
    }

    await cart.save();
    
    // Fetch with populated details
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.menuItem',
      select: 'name price image isVeg isAvailable'
    });

    res.json({ success: true, data: populatedCart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity/instructions
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { menuItem, quantity, specialInstructions } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === menuItem
    );

    if (itemIndex > -1) {
      if (quantity !== undefined) {
        if (Number(quantity) <= 0) {
          // Remove if quantity is 0 or negative
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity = Number(quantity);
        }
      }
      
      if (specialInstructions !== undefined && itemIndex < cart.items.length) {
        cart.items[itemIndex].specialInstructions = specialInstructions;
      }

      await cart.save();

      const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'items.menuItem',
        select: 'name price image isVeg isAvailable'
      });

      return res.json({ success: true, data: populatedCart });
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== req.params.itemId
    );

    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.menuItem',
      select: 'name price image isVeg isAvailable'
    });

    res.json({ success: true, data: populatedCart });
  } catch (error) {
    next(error);
  }
};
