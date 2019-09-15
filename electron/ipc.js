const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const Store = require('electron-store');

const IGCAnalyzer = require('./igc');

const store = new Store();

const {
  addTrace,
  getTraces,
  getTraceById,
  addTag,
  removeTag,
} = require('./db/repo');

const returnAnalyze = (filePath, lastData, event) => {
  try {
    const igcData = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    const analyzer = new IGCAnalyzer(igcData);
    lastData = analyzer.parse(true, true);
    event.reply('openFileFinish', {
      path: filePath,
      filename: filename,
      data: lastData,
      hash: sha1(igcData),
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
    const data = d;
    delete data.dataValues.createdAt;
    delete data.dataValues.updatedAt;
    delete data.dataValues.TraceId;
    return data.dataValues;
  });

  delete result.dataValues.Tags;
  delete result.dataValues.createdAt;
  delete result.dataValues.updatedAt;
  return ({
    ...result.dataValues,
    data,
    tags,
  });
};

const openFile = (event) => {
  return async (data) => {
    // on result parse each file
    let lastData;
    if (!data || !data.filePaths || data.filePaths.length === 0) {
      event.reply('openFileErr', {
        err: 'empty filepath',
      });
    }

    returnAnalyze(data.filePaths[0], lastData, event);
    store.clear('last_file');
    store.set('last_file', data.filePaths[0]);
  };
};

const getLast = (event) => {
  const last = store.get('last_file');
  if (!last) {
    return;
  }
  // opening last file opened
  openFile(event)({
    filePaths: [last],
  });
};

const saveTrace = async (date, hash, path) => {
  await addTrace(date, hash, path);
};

const traces = async (event, args) => {
  const results = await getTraces(args.page, (args.page + 1) * args.sizePerPage);
  event.reply('getIgcFilesResult', {
    count: results.count,
    rows: results.rows.map((d) => d && mapEntityToJson(d)),
  });
};

const traceById = async (event, args) => {
  const result = await getTraceById(args.id);
  const t = mapEntityToJson(result);
  event.reply('selectedIgcResult', t);
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

