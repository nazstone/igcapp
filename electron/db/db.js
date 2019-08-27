const Sequelize = require('sequelize');

const Trace = require('./model/trace');
const Tag = require('./model/tag');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.trace = Trace(db.sequelize);
db.tag = Tag((db.sequelize));

db.trace.hasMany(db.tag);
db.tag.belongsTo(db.trace);

module.exports = db;
