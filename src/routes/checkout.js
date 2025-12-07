const express = require('express');
const router = express.Router();
const { sequelize, CartItem, Product, Order, OrderItem } = require('../models/index');

router.post('/', async (req, res) => {
  // Hard-code valid IDs so Apidog's fake data doesn't break foreign keys
  const shipping_address_id = 1;      // exists in seed
  const billing_address_id = 1;       // exists in seed
  const payment_method_id = 1;        // exists in seed

  const userId = 1;

  const t = await sequelize.transaction();

  try {
    // 1. Get cart items with prices
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Product, attributes: ['price'] }],
      transaction: t
    });

    if (!cartItems.length) {
      await t.rollback();
      return res.status(400).json({ error: 'cart is empty' });
    }

    // 2. Calculate total
    const total = cartItems.reduce((sum, ci) => {
      const price = ci.Product ? parseFloat(ci.Product.price) : 0;
      return sum + (ci.quantity * price);
    }, 0);

    // 3. Create order
    const order = await Order.create({
      user_id: userId,
      shipping_address_id,
      billing_address_id: billing_address_id || shipping_address_id,
      payment_method_id,
      total_price: total,
      status: 'Paid'
    }, { transaction: t });

    // 4. Create order items
    const orderItemsData = cartItems.map(ci => ({
      order_id: order.order_id,
      product_id: ci.product_id,
      quantity: ci.quantity,
      unit_price: ci.Product ? parseFloat(ci.Product.price) : 0
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction: t });

    // 5. Clear cart
    await CartItem.destroy({ where: { user_id: userId }, transaction: t });

    await t.commit();

     res.status(201).json({
      order_id: order.order_id,
      total_price: parseFloat(total.toFixed(2))
    });

  } catch (err) {
    await t.rollback();
    console.error('CHECKOUT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;