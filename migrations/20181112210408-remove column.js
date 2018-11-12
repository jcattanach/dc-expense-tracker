'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'monthly_income'
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'monthly_income',{
        allowNull: false,
        type: Sequelize.DOUBLE
      }
    )
  }
  }
