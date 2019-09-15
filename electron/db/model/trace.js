const Sequelize = require('sequelize');

const { Model } = Sequelize;

module.exports = (sequelize) => {
  class Trace extends Model {}
  Trace.init({
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: Sequelize.DataTypes.DATE,
    },
    hash: {
      type: Sequelize.DataTypes.TEXT,
    },
  }, {
    sequelize,
  });
  return Trace;
};
