const Sequelize = require('sequelize');

const { Model } = Sequelize;

module.exports = (sequelize) => {
  class Tag extends Model {}
  Tag.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
  });
  return Tag;
};
