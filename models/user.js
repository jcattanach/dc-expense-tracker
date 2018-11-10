'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    monthly_income: DataTypes.DOUBLE
  }, {});
  user.associate = function(models) {
    user.hasMany(models.transaction, {as: 'transaction', foreignKey: 'userid'})
  };
  return user;
};