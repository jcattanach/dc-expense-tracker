'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn(
      'budgets',
      'category', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn(
      'budgets',
      'amount', {
        type: Sequelize.FLOAT
      })
    ]
  },

  down: (queryInterface, Sequelize) => {
  }
};
