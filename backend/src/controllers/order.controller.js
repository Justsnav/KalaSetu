const asyncHandler = require('../utils/asyncHandler');
const Order = require('../models/order');
const Product = require('../models/product');

// Create Order (Protected, for buyers or authenticated users)
const createOrder = asyncHandler(async (req, res) => {
  const buyerId = req.user._id;
  const { items, shippingAddress } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: 'Order must contain at least one item.'
    });
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
    return res.status(400).json({
      message: 'Complete shipping address is required.'
    });
  }

  const orderItems = [];
  let totalAmount = 0;

  // Validate products, stock, and build order items with correct prices and artisan references
  for (const item of items) {
    const product = await Product.findById(item.product || item.productId || item._id);

    if (!product) {
      return res.status(404).json({
        message: `Product not found: ${item.title || item.product}`
      });
    }

    const requestedQty = Number(item.quantity) || 1;

    if (product.stock < requestedQty) {
      return res.status(400).json({
        message: `Insufficient stock for "${product.title}". Only ${product.stock} available.`
      });
    }

    // Decrement stock
    product.stock -= requestedQty;
    await product.save();

    const price = Number(product.price);
    const itemTotal = price * requestedQty;
    totalAmount += itemTotal;

    orderItems.push({
      product: product._id,
      artisan: product.artistId,
      title: product.title,
      image: Array.isArray(product.image) ? product.image[0] : (product.image || ''),
      price: price,
      quantity: requestedQty
    });
  }

  const newOrder = await Order.create({
    buyer: buyerId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    status: 'pending'
  });

  res.status(201).json({
    message: 'Order placed successfully',
    order: newOrder
  });
});

// Get orders for current user (Buyer sees their orders, Artisan sees orders containing their products)
const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  let query;
  if (userRole === 'artisan') {
    query = { 'items.artisan': userId };
  } else {
    query = { buyer: userId };
  }

  const orders = await Order.find(query)
    .populate('buyer', 'name email phone')
    .populate('items.artisan', 'name location craft')
    .sort({ createdAt: -1 });

  // If artisan, filter or format if needed, and calculate statistics
  if (userRole === 'artisan') {
    let artisanRevenue = 0;
    let artisanProductCount = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.artisan && item.artisan._id && item.artisan._id.toString() === userId.toString()) {
          artisanRevenue += item.price * item.quantity;
          artisanProductCount += item.quantity;
        }
      });
    });

    return res.json({
      orders,
      stats: {
        totalOrders: orders.length,
        totalRevenue: artisanRevenue,
        itemsSold: artisanProductCount
      }
    });
  }

  res.json({
    orders
  });
});

// Get single order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  const order = await Order.findById(id)
    .populate('buyer', 'name email phone')
    .populate('items.artisan', 'name location craft');

  if (!order) {
    return res.status(404).json({
      message: 'Order not found'
    });
  }

  // Authorization check
  const isBuyer = order.buyer._id.toString() === userId.toString();
  const isArtisan = order.items.some(
    item => item.artisan && item.artisan._id && item.artisan._id.toString() === userId.toString()
  );

  if (!isBuyer && !isArtisan) {
    return res.status(403).json({
      message: 'You are not authorized to view this order.'
    });
  }

  res.json({
    order
  });
});

// Update order status (Artisan)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const order = await Order.findById(id);
  if (!order) {
    return res.status(404).json({
      message: 'Order not found'
    });
  }

  const isArtisan = order.items.some(
    item => item.artisan.toString() === userId.toString()
  );

  if (!isArtisan) {
    return res.status(403).json({
      message: 'You are not authorized to update this order status.'
    });
  }

  order.status = status;
  order.updatedAt = Date.now();
  await order.save();

  res.json({
    message: `Order status updated to ${status}`,
    order
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
};
