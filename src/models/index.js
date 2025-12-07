const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

/* PRODUCT */
const Product = sequelize.define('Product', {
  product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  inventory: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'product',
  underscored: true,
  timestamps: false
});

/* CART */
const CartItem = sequelize.define('CartItem', {
  cart_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
  tableName: 'cart_item',
  underscored: true,
  timestamps: false
});

/* ORDER */
const Order = sequelize.define('Order', {
  order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  shipping_address_id: { type: DataTypes.INTEGER, allowNull: false },
  billing_address_id: { type: DataTypes.INTEGER },
  payment_method_id: { type: DataTypes.INTEGER, allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Paid' },
  order_date: {                                   // ← THIS WAS MISSING BEFORE
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'order',
  underscored: true,
  timestamps: false
});

/* ORDER ITEM */
const OrderItem = sequelize.define('OrderItem', {
  order_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unit_price: { type: DataTypes.DECIMAL(10,2), allowNull: false }
}, {
  tableName: 'order_item',
  underscored: true,
  timestamps: false
});

CartItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(CartItem, { foreignKey: 'product_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

module.exports = {
  sequelize,
  Product,
  CartItem,
  Order,
  OrderItem
};