const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueData,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role / status (Admin)
// @route   PUT /api/admin/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User updated', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
