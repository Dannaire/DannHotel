'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'users',
        'role',
        {
          type: Sequelize.ENUM('admin', 'resepsionis', 'tamu'),
          allowNull: true,
          defaultValue: 'tamu', // Set the default role to "tamu"
        },
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('users', 'role', { transaction });
    });
  },
};
