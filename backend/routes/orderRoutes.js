import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus,
  assignDeliveryStaff
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order routes require login

router.route('/')
  .post(createOrder)
  .get(authorize('admin', 'delivery'), getOrders);

router.route('/my-orders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(authorize('admin', 'delivery'), updateOrderStatus);

router.route('/:id/assign')
  .put(authorize('admin'), assignDeliveryStaff);

export default router;
