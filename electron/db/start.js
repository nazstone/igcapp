const Umzug = require('umzug');
const path = require('path');

const db = require('./db');

module.exports = () => new Promise((res, rej) => {
  db.sequelize.authenticate().then(() => {
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: db.sequelize,
      },
      migrations: {
        params: [
          db.sequelize.getQueryInterface(),
          db.Sequelize,
          {
            trace: db.trace,
            tag: db.tag,
          },
        ],
        path: path.join(__dirname, './migrations'),
      },
    });

    return umzug.up();
  }).then(() => res(db)).catch((err) => rej(err));
});
