const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Wishlist = sequelize.define('Wishlist', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'user_id' },
    allowNull: false,
  }
}, {
  timestamps: true,
});

User.hasOne(Wishlist, { foreignKey: 'user_id' });
Wishlist.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Wishlist;
