import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: [0, 'Discount value cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: true
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Helper to check if a coupon is valid
couponSchema.methods.isValid = function (orderValue) {
  const now = new Date();
  return (
    this.isActive &&
    now <= this.expiryDate &&
    orderValue >= this.minOrderValue
  );
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
