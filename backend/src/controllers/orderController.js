const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create order
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // Update stock and sold count
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow the order owner or admin to view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { orderStatus: status } : {};

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Order.countDocuments(query),
    ]);

    res.json({ success: true, orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    await order.save();
    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};
