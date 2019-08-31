const IGCAnalyzer = require('igc-analyzer');
const fs = require('fs');

const {
  addTrace,
  getTraces,
  getTraceLast,
} = require('./db/repo');

class IpcMain {
  upload(event) {
    const method = async (data) => {
      // on result parse each file
      let lastData;
      if (data && data.filePaths && data.filePaths.length > 0) {
        let i = 0;
        // eslint-disable-next-line no-restricted-syntax
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

  async getTraces(event) {
    const results = await getTraces(0, 10);
    event.reply('getIgcFilesResult', results.map((d) => d.toJSON()));
  }

  async getTraceLast(event) {
    const result = await getTraceLast();
    event.reply('getIgcLastResult', result ? result.dataValues : null);
  }
}

module.exports = IpcMain;
