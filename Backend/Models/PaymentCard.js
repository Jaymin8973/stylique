const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const PaymentCard = sequelize.define('PaymentCard', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {                   
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  cardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cardHolderName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cvv: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'payment_cards',
});

PaymentCard.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(PaymentCard, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = PaymentCard;
