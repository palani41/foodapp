import express from 'express';
import {
  addReview,
  getReviewsForMenuItem
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addReview);

router.route('/:menuItemId')
  .get(getReviewsForMenuItem);

export default router;
