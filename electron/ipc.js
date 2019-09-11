const fs = require('fs');
const IGCAnalyzer = require('./igc');

const {
  addTrace,
  getTraces,
  getTraceById,
  getTraceLast,
  addTag,
  removeTag,
} = require('./db/repo');

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
    data: result.dataValues.data && JSON.parse(result.dataValues.data),
    tags,
  });
};

const upload = (event) => {
  return async (data) => {
    // on result parse each file
    let lastData;
    if (data && data.filePaths && data.filePaths.length > 0) {
      let i = 0;
      // eslint-disable-next-line
      for (const filePathTmp of data.filePaths) {
        // analyze and add in db
        const igcData = fs.readFileSync(filePathTmp);
        const analyzer = new IGCAnalyzer(igcData);
        lastData = analyzer.parse(true, true);
        await addTrace(lastData); // eslint-disable-line

        // notification progress
        i += 1;
        event.reply('addIgcFileProgress', {
          done: i,
          total: data.filePaths.length,
        });
      }
    }

    // notification end
    event.reply('addIgcFileResult', lastData);
  };
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

const traceLast = async (event) => {
  const result = await getTraceLast();
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
  traceLast,
  upload,
};
