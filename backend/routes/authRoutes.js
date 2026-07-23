import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getDeliveryStaff
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully. Clear token from client storage.' });
});
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/delivery-staff', protect, authorize('admin'), getDeliveryStaff);

export default router;
