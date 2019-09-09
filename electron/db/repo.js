const Umzug = require('umzug');
const path = require('path');
const sha1 = require('sha1');
const moment = require('moment');

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
  // todo transform data to json
  const str = JSON.stringify(data);
  const hash = sha1(str);

  let date = new Date();
  if (data.metadata.date) {
    date = moment(data.metadata.date, 'DDMMYY').format();
  }

  await db.trace.findOrCreate({
    where: {
      hash,
    },
    defaults: {
      data: str,
      hash,
      date,
    },
  });
};

const getTraces = async (offset, limit) => {
  const data = await db.trace.findAndCountAll({
    attributes: {
      exclude: ['data'],
    },
    offset,
    limit,
  });
  return data;
};

const getTraceLast = async () => {
  const data = await db.trace.findOne({
    order: [
      'date',
    ],
  });
  return data;
};

const getTraceById = async (id) => {
  const data = await db.trace.findOne({
    where: {
      id,
    },
  });
  return data;
};

module.exports = {
  start,
  addTrace,
  getTraces,
  getTraceById,
  getTraceLast,
};
