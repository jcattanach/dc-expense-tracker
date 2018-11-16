'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('budgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      food: {
        type: Sequelize.FLOAT
      },
      education: {
        type: Sequelize.FLOAT
      },
      housing: {
        type: Sequelize.FLOAT
      },
      transportation: {
        type: Sequelize.FLOAT
      },
      personal_expenses: {
        type: Sequelize.FLOAT
      },
      bills: {
        type: Sequelize.FLOAT
      },
      other: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('budgets');
  }
};
