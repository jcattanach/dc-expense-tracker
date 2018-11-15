'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn(
      'budgets',
      'food'
    ),
    queryInterface.removeColumn(
      'budgets',
      'education'
    ),
    queryInterface.removeColumn(
      'budgets',
      'housing'
    ),
    queryInterface.removeColumn(
      'budgets',
      'transportation'
    ),
    queryInterface.removeColumn(
      'budgets',
      'personal_expenses'
    ),
    queryInterface.removeColumn(
      'budgets',
      'bills'
    ),
    queryInterface.removeColumn(
      'budgets',
      'other'
    )
  ]
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
