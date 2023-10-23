'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('customer', 'role', {
      type: Sequelize.STRING, // You can use the appropriate data type for your "role" column
      allowNull: false,
      defaultValue: 'tamu', // Set the default value to 'tamu'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('customer', 'role');
  },
};
