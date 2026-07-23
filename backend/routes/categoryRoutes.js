import express from 'express';
import {
  getCategories,
  createCategory,
  deleteCategory
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), upload.single('image'), createCategory);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteCategory);

export default router;
