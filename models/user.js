'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  user.associate = function(models) {
    user.hasMany(models.transaction, {as: 'transaction', foreignKey: 'userid', onDelete: 'CASCADE'})
    user.hasMany(models.budget, {as: 'budget', foreignKey: 'userid', onDelete: 'CASCADE'})
  };
  return user;
};
