const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const Store = require('electron-store');
const { app } = require('electron');

const IGCAnalyzer = require('./igc');

const store = new Store();

const {
  addTrace,
  getTraces,
  getTraceById,
  addTag,
  removeTag,
} = require('./db/repo');

const returnAnalyze = (filePath, event, dbTrace) => {
  try {
    const igcData = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    const analyzer = new IGCAnalyzer(igcData);
    const lastData = analyzer.parse(true, true);
    event.reply('openFileFinish', {
      path: filePath,
      filename,
      data: lastData,
      hash: sha1(igcData),
      dbTrace,
    });
  } catch (err) {
    event.reply('openFileErr', err);
  }
};

const mapEntityToJson = (r) => {
  const result = r;
  if (!result) {
    return {};
  }
  const tags = result.dataValues.Tags.map((d) => {
    delete d.dataValues.createdAt;
    delete d.dataValues.updatedAt;
    delete d.dataValues.TraceId;
    return d.dataValues;
  });

  delete result.dataValues.Tags;
  delete result.dataValues.createdAt;
  delete result.dataValues.updatedAt;
  return ({
    ...result.dataValues,
    tags,
  });
};

const openFile = (event) => {
  /** data is a object with path and traceId */
  return async ({ path, traceId }) => {
    // on result parse each file
    if (!path && !traceId) {
      event.reply('openFileErr', {
        err: 'empty filepath',
      });
      return;
    }

    let dbTrace = {};
    if (traceId) {
      const result = await getTraceById(traceId);
      dbTrace = mapEntityToJson(result);
    }

    returnAnalyze(path || dbTrace.path, event, dbTrace);
    store.clear('last_file');
    store.set('last_file', {
      traceId,
      path,
    });
  };
};

const getLast = (event) => {
  const igcappStore = store.get('last_file');
  if (!igcappStore) {
    return;
  }
  // opening last file opened
  openFile(event)(igcappStore);
};

const saveTrace = async (event, { date, hash, path: pathTmp, }) => {
  try {
    // Move the file to $HOME
    const filename = path.basename(pathTmp);
    const dir = `${app.getPath('userData')}/traces`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const newPath = `${dir}/${filename}`;
    fs.createReadStream(pathTmp).pipe(fs.createWriteStream(newPath));

    // save db
    const res = await addTrace(date, hash, newPath);
    event.reply('saveFileResult', {
      ok: true,
      data: res[0].dataValues,
    });
    // store
    store.set('last_file', {
      traceId: res[0].dataValues.id,
      path: newPath,
    });
  } catch (err) {
    console.error(err);
    event.reply('saveFileResult', {
      ok: false,
      err: 'Cannot save file',
    });
  }
};

const traces = async (event, args) => {
  const results = await getTraces(args.page, (args.page + 1) * args.sizePerPage);
  event.reply('getIgcFilesResult', {
    count: results.count,
    rows: results.rows.map((d) => d && mapEntityToJson(d)),
  });
};

const traceById = async (event, args) => {
  openFile(event)({
    traceId: args.id
  });
};

const newTag = async (event, args) => {
  await addTag(args.text, args.traceId);
  await traceById(event, {
    id: args.traceId,
  });
};

const removeTagById = async (event, args) => {
  await removeTag(args.id);
  await traceById(event, {
    id: args.traceId,
  });
};

module.exports = {
  newTag,
  removeTagById,
  traces,
  traceById,
  openFile,
  saveTrace,
  getLast,
};

