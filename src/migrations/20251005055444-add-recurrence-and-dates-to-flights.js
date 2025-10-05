'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the columns don't already exist before adding
    await queryInterface.addColumn('Flights', 'recurrence', {
      type: Sequelize.ENUM('DAILY', 'WEEKLY', 'ONCE'),
      allowNull: false,
      defaultValue: 'ONCE'
    });

    await queryInterface.addColumn('Flights', 'startDate', {
      type: Sequelize.DATEONLY,
      allowNull: false
    });

    await queryInterface.addColumn('Flights', 'endDate', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Flights', 'recurrence');
    await queryInterface.removeColumn('Flights', 'startDate');
    await queryInterface.removeColumn('Flights', 'endDate');

    // Drop ENUM manually (important for PostgreSQL, optional for MySQL)
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Flights_recurrence";');
  }
};
