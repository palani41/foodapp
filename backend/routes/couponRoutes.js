import express from 'express';
import {
  createCoupon,
  getCoupons,
  validateCoupon
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin'), createCoupon)
  .get(protect, authorize('admin'), getCoupons);

router.route('/validate')
  .post(protect, validateCoupon);

export default router;
