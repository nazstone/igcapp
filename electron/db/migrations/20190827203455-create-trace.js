
module.exports = {
  up: (queryInterface, Sequelize, model) => {
    console.info('migration create trace');
    return queryInterface.createTable(model.trace.tableName, model.trace.tableAttributes);
  },
  down: (queryInterface) => {
    console.info('migration delete trace');
    return queryInterface.dropTable('Trace');
  },
};
