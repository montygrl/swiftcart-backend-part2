const express = require('express');
const router = express.Router();
const { CartItem, Product } = require('../models/index');

// GET cart — show current cart
router.get('/', async (req, res) => {
  const userId = 1;

  try {
    const itemsRaw = await CartItem.findAll({
      where: { user_id: userId },
      include: [{ model: Product }]
    });

    const items = itemsRaw.map(ci => ({
      product_id: ci.product_id,
      name: ci.Product.name,
      quantity: ci.quantity,
      unit_price: parseFloat(ci.Product.price),
      line_total: parseFloat((ci.quantity * ci.Product.price).toFixed(2))
    }));

    const total_price = parseFloat(items.reduce((sum, i) => sum + i.line_total, 0).toFixed(2));

    res.json({ items, total_price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST cart — add item
router.post('/', async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  const userId = 1;

  if (!product_id || quantity < 1) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const existing = await CartItem.findOne({ where: { user_id: userId, product_id } });
    if (existing) {
      await existing.increment('quantity', { by: quantity });
    } else {
      await CartItem.create({ user_id: userId, product_id, quantity });
    }
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH cart:product_id — update quantity
router.patch('/:product_id', async (req, res) => {
  const { product_id } = req.params;
  const { quantity } = req.body;
  const userId = 1;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be >= 1' });
  }

  try {
    const item = await CartItem.findOne({ where: { user_id: userId, product_id } });
    if (!item) return res.status(404).json({ error: 'Not in cart' });

    await item.update({ quantity });
    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE cart/:product_id — remove item
router.delete('/:product_id', async (req, res) => {
  const { product_id } = req.params;
  const userId = 1;

  try {
    await CartItem.destroy({ where: { user_id: userId, product_id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;