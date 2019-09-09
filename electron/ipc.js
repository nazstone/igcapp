const fs = require('fs');
const IGCAnalyzer = require('./igc');

const {
  addTrace,
  getTraces,
  getTraceById,
  getTraceLast,
} = require('./db/repo');

class IpcMain {
  upload(event) {
    const method = async (data) => {
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
    return method;
  }

  async getTraces(event, args) {
    const results = await getTraces(args.page, (args.page + 1) * args.sizePerPage);
    event.reply('getIgcFilesResult', {
      count: results.count,
      rows: results.rows.map((d) => d.toJSON()),
    });
  }

  async getTraceById(event, args) {
    const result = await getTraceById(args.id);
    const data = result && {
      ...result.dataValues,
      data: JSON.parse(result.dataValues.data),
    };
    event.reply('selectedIgcResult', data);
  }

  async getTraceLast(event) {
    const result = await getTraceLast();
    const data = result && {
      ...result.dataValues,
      data: JSON.parse(result.dataValues.data),
    };
    event.reply('selectedIgcResult', data);
  }
}

module.exports = IpcMain;
