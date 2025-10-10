const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'user_id' },
    allowNull: false,
  }
}, {
  timestamps: true,
});

User.hasOne(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Cart;
