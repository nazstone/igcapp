
module.exports = {
  up: (queryInterface, _, model) => {
    console.info('migration create tags');
    return queryInterface.createTable(model.tag.tableName, model.tag.tableAttributes);
  },
  down: (queryInterface, _, model) => {
    console.info('migration delete tags');
    return queryInterface.dropTable(model.tag.tableName);
  },
};
