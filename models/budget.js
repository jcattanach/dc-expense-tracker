'use strict';
module.exports = (sequelize, DataTypes) => {
  const budget = sequelize.define('budget', {
    food: DataTypes.FLOAT,
    education: DataTypes.FLOAT,
    housing: DataTypes.FLOAT,
    transportation: DataTypes.FLOAT,
    personal_expenses: DataTypes.FLOAT,
    bills: DataTypes.FLOAT,
    other: DataTypes.FLOAT
  }, {});
  budget.associate = function(models) {
    // associations can be defined here
  };
  return budget;
};
