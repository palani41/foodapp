import express from 'express';
import { getDashboardAnalytics } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, authorize('admin'), getDashboardAnalytics);

export default router;
