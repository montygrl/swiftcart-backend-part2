require('dotenv').config();
const express = require('express');
const { sequelize, Product } = require('./models/index');

const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const ordersRouter = require('./routes/orders');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['product_id', 'name', 'description', 'price']
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', ordersRouter);

// Start server
app.listen(port, async () => {
  console.log(`Server is running → http://localhost:${port}`);

  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Seed only if empty — NO .sync()
    const count = await Product.count();
    if (count === 0) {
      console.log('Empty DB → running seed.sql');
      const fs = require('fs');
      const sql = fs.readFileSync('./src/seed.sql', 'utf8')
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const stmt of sql) {
        await sequelize.query(stmt + ';');
      }
      console.log('Seed completed');
    }
  } catch (err) {
    console.log('Non-fatal startup error (server still runs):', err.message);
  }
});

module.exports = app;