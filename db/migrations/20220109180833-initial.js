'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // console.log(queryInterface)
    return queryInterface.sequelize.query(`SELECT 1`);
  },

  down: async (queryInterface, Sequelize) => {
    return null;
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
