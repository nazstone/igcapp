const Sequelize = require('sequelize');
const path = require('path');

const Trace = require('./model/trace');
const Tag = require('./model/tag');

console.log(path.join(__dirname, './database.sqlite'));
const sequelize = new Sequelize({
  logging: false,
  dialect: 'sqlite',
  storage: path.join(__dirname, './database.sqlite'),
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.trace = Trace(db.sequelize);
db.tag = Tag((db.sequelize));

db.trace.hasMany(db.tag);
db.tag.belongsTo(db.trace);

module.exports = db;
