const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Address = sequelize.define('Address', {
  address_id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    user_id: {                   
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'user_id',
      },
    },
  firstName:{
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName:{
    type: DataTypes.STRING,
    allowNull: false
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  houseNo:{
    type:DataTypes.STRING,
    allowNull:false
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressType: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
 
Address.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Address, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

module.exports = Address;