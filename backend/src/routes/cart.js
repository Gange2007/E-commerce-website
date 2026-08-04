const express = require('express');
const router = express.Router();

// Cart is managed on frontend, this is placeholder for future enhancements
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Cart managed on client side' });
});

module.exports = router;
