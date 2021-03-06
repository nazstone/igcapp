const Umzug = require('umzug');
const path = require('path');
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

// const hash = sha1(str);
const addTrace = async (dateStr, hash, path) => {

  let date = new Date();
  try {
    if (date) {
      date = moment(dateStr, 'DDMMYY').format();
    }
  } catch (err) {
  }

  return await db.trace.findOrCreate({
    where: {
      hash,
    },
    defaults: {
      path,
      hash,
      date,
    },
  });
};

const getTraces = async (offset, limit) => {
  const rows = await db.trace.findAll({
    include: [{
      model: db.tag,
    }],
    offset,
    limit,
  });
  const count = await db.trace.count();
  return {
    rows,
    count,
  };
};

const getTraceLast = async () => {
  const data = await db.trace.findOne({
    order: [
      'date',
    ],
    include: [{
      model: db.tag,
    }],
  });
  return data;
};

const getTraceById = async (id) => {
  const data = await db.trace.findOne({
    where: {
      id,
    },
    include: [{
      model: db.tag,
    }],
  });
  return data;
};

const removeTag = async (id) => {
  // await db.tag.delete()
  await db.tag.destroy({
    where: {
      id,
    },
  });
};

const addTag = async (text, traceId) => {
  const t = await getTraceById(traceId);
  const tag = await db.tag.create({
    text,
  });
  tag.setTrace(t);
  await tag.save();
};

module.exports = {
  start,
  addTrace,
  getTraces,
  getTraceById,
  getTraceLast,
  addTag,
  removeTag,
};
