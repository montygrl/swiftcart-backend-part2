const request = require('supertest');
const app = require('../src/server');
const { sequelize, CartItem } = require('../src/models/index');

beforeAll(async () => {
  await sequelize.sync();
  await CartItem.destroy({ where: {} });
});

test('POST /cart adds an item', async () => {
  const res = await request(app)
    .post('/cart')
    .send({ product_id: 1, quantity: 2 });

  expect(res.status).toBe(201);
});

test('GET /cart returns items', async () => {
  const res = await request(app).get('/cart');

  expect(res.status).toBe(200);
  expect(res.body.items.length).toBeGreaterThan(0);
  expect(res.body.total_price).toBeGreaterThan(0);
});
