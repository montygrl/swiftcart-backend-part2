const express = require('express');
const router = express.Router();
const { Order } = require('../models/index');

router.get('/', async (req, res) => {
  const userId = 1;

  try {
    const orders = await Order.findAll({
      where: { user_id: userId },
      attributes: ['order_id', 'order_date', 'total_price', 'status'],
      order: [['order_date', 'DESC']]
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;