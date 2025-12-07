const request = require('supertest');
const app = require('../src/server');
const { sequelize } = require('../src/models/index');

beforeAll(async () => {
  await sequelize.sync();
});

test('POST /checkout creates an order', async () => {
  const res = await request(app)
    .post('/checkout')
    .send({
      shipping_address_id: 1,
      payment_method_id: 1
    });

  expect(res.status).toBe(201);
  expect(res.body.order_id).toBeGreaterThan(0);
});
