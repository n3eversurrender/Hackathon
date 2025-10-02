'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change start_time and end_time from DATE to TIME
    await queryInterface.changeColumn('sessions', 'start_time', {
      type: Sequelize.TIME,
      allowNull: false,
    });

    await queryInterface.changeColumn('sessions', 'end_time', {
      type: Sequelize.TIME,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back to DATE
    await queryInterface.changeColumn('sessions', 'start_time', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.changeColumn('sessions', 'end_time', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
