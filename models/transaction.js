'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    name: DataTypes.STRING,
    amount: DataTypes.DOUBLE,
    category: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  transaction.associate = function(models) {
    transaction.belongsTo(models.user, {as: 'transaction', foreignKey: 'id'})
  };
  return transaction;
};