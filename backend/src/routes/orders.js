const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, updateTrackingUrl, updateAdminNotes, getOrderStats, trackOrder, returnOrder, handleItemReturn, requestOrderCancellation, handleCancellationRequest } = require('../controllers/orderController');
const { protect, adminOnly, adminOrVendor } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.post('/track', trackOrder);
router.get('/my', protect, getMyOrders);
router.get('/stats', protect, adminOrVendor, getOrderStats);
router.get('/', protect, adminOrVendor, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOrVendor, updateOrderStatus);
router.put('/:id/tracking', protect, adminOrVendor, updateTrackingUrl);
router.put('/:id/admin-notes', protect, adminOrVendor, updateAdminNotes);
router.put('/:id/return', protect, returnOrder);
router.put('/:id/return-item-handle', protect, adminOrVendor, handleItemReturn);
router.put('/:id/cancel', protect, requestOrderCancellation);
router.put('/:id/cancel-handle', protect, adminOrVendor, handleCancellationRequest);

const { sendEmail } = require('../utils/emailService');
router.post('/test-email', protect, adminOnly, async (req, res) => {
  const targetEmail = req.body.email || req.user.email;
  try {
    await sendEmail({
      to: targetEmail,
      subject: 'Test Email from Owl Stitch (Hostinger SMTP)',
      html: `<div style="font-family:sans-serif;padding:20px;border:1px solid #e2e8f0;border-radius:8px;">
        <h2 style="color:#C08A74;">Hostinger SMTP Test Successful! 🎉</h2>
        <p>If you are seeing this email, your Hostinger hPanel SMTP configuration is working properly.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      </div>`
    });
    res.json({ success: true, message: `Test email sent to ${targetEmail}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
