'use strict';
module.exports = (sequelize, DataTypes) => {
  const budget = sequelize.define('budget', {
    category: DataTypes.STRING,
    amount: DataTypes.FLOAT
  }, {});
  budget.associate = function(models) {
    budget.belongsTo(models.user, {as: 'budget', foreignKey: 'id'})
  };
  return budget;
};
