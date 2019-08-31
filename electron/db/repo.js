const Umzug = require('umzug');
const path = require('path');
const sha1 = require('sha1');

const db = require('./db');

const start = () => new Promise((res, rej) => {
  db.sequelize.authenticate()
    .then(() => {
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
    })
    .then((migrationFiles) => console.log('migration:', migrationFiles))
    .then(() => res(db))
    .catch((err) => rej(err));
});

const addTrace = async (data) => {
  const str = JSON.stringify(data);
  const hash = sha1(str);

  await db.trace.findOrCreate({
    where: {
      hash,
    },
    defaults: {
      data: str,
      hash,
      date: new Date(),
    },
  });
};

const getTraces = async (offset, limit) => {
  const data = await db.trace.findAll({
    attributes: {
      exclude: ['data'],
    },
    offset,
    limit,
  });
  return data;
};

module.exports = {
  start,
  addTrace,
  getTraces,
};