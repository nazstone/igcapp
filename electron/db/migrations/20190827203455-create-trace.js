module.exports = {
  up: (queryInterface, Sequelize) => {
    console.info('migration create trace');
    return queryInterface.createTable('Traces', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      data: {
        type: Sequelize.JSON,
      },
      date: {
        type: Sequelize.DATE,
      },
      description: {
        type: Sequelize.TEXT,
      },
      hash: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => {
    console.info('migration delete trace');
    return queryInterface.dropTable('Traces');
  },
};
