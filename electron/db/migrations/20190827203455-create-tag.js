
module.exports = {
  up: (queryInterface, Sequelize, model) => {
    console.info('migration create tags');
    return queryInterface.createTable(model.tag.tableName, model.tag.tableAttributes);
  },
  down: (queryInterface) => {
    console.info('migration delete tags');
    return queryInterface.dropTable('Tags');
  },
};
