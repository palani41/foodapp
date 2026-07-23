import mongoose from 'mongoose';
import MenuItem from './MenuItem.js';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Avoid duplicate reviews from the same user on the same item
reviewSchema.index({ user: 1, menuItem: 1 }, { unique: true });

// Static method to get avg ratings
reviewSchema.statics.calculateAverageRating = async function(menuItemId) {
  const obj = await this.aggregate([
    {
      $match: { menuItem: menuItemId }
    },
    {
      $group: {
        _id: '$menuItem',
        averageRating: { $avg: '$rating' },
        nReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj.length > 0) {
      await MenuItem.findByIdAndUpdate(menuItemId, {
        ratings: Math.round(obj[0].averageRating * 10) / 10,
        numReviews: obj[0].nReviews
      });
    } else {
      await MenuItem.findByIdAndUpdate(menuItemId, {
        ratings: 0,
        numReviews: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.menuItem);
});

// Call calculateAverageRating before deletion (or on findOneAndDelete)
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.menuItem);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
