import express from 'express';
import {
  getTables,
  createTable,
  updateTable,
  deleteTable
} from '../controllers/tableController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTables)
  .post(protect, authorize('admin'), createTable);

router.route('/:id')
  .put(protect, authorize('admin'), updateTable)
  .delete(protect, authorize('admin'), deleteTable);

export default router;
