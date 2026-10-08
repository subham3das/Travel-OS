import { Router } from 'express';
import { couponController } from '../controllers/coupon.controller.js';
import { authenticateAdmin } from '../middlewares/adminAuth.middleware.js';

const router = Router();

// Public Coupon Endpoints (Partner/Customer Checkout)
router.post('/validate', couponController.validateOrApplyCoupon.bind(couponController));
router.post('/apply', couponController.validateOrApplyCoupon.bind(couponController));

// Admin Coupon Management Endpoints
router.get('/admin/stats', authenticateAdmin, couponController.adminGetStats.bind(couponController));
router.get('/admin/analytics', authenticateAdmin, couponController.adminGetAnalytics.bind(couponController));
router.get('/admin/export', authenticateAdmin, couponController.adminExportCoupons.bind(couponController));
router.get('/admin', authenticateAdmin, couponController.adminListCoupons.bind(couponController));
router.post('/admin', authenticateAdmin, couponController.adminCreateCoupon.bind(couponController));
router.patch('/admin/:id', authenticateAdmin, couponController.adminUpdateCoupon.bind(couponController));
router.delete('/admin/:id', authenticateAdmin, couponController.adminDeleteCoupon.bind(couponController));

export default router;
