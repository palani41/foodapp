import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, authorize('admin'), upload.single('image'), createMenuItem);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, authorize('admin'), upload.single('image'), updateMenuItem)
  .delete(protect, authorize('admin'), deleteMenuItem);

export default router;
