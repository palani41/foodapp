import Review from '../models/Review.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Add a review for a menu item
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    const { menuItem, rating, comment } = req.body;

    const item = await MenuItem.findById(menuItem);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    // Check if user has already reviewed this item
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      menuItem
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this menu item');
    }

    const review = await Review.create({
      user: req.user._id,
      menuItem,
      rating: Number(rating),
      comment: comment || ''
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a menu item
// @route   GET /api/reviews/:menuItemId
// @access  Public
export const getReviewsForMenuItem = async (req, res, next) => {
  try {
    const reviews = await Review.find({ menuItem: req.params.menuItemId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};
