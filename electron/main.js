const {
  dialog, ipcMain, app, BrowserWindow,
} = require('electron');// eslint-disable-line

const path = require('path');
const isDev = require('electron-is-dev');
const IGCAnalyzer = require('igc-analyzer');
const fs = require('fs');

const { start, addTrace, getTraces } = require('./db/repo');

let mainWindow;

const createWindow = async () => {
  // create db
  await start();

  // create browser
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  if (isDev) {
    console.log('debug on eletron enabled');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('getIgcFiles', async (event) => {
  const results = await getTraces(0, 10);
  event.reply('getIgcFilesResult', results.map((d) => d.toJSON()));
});

ipcMain.on('addIgcFileAsk', (event) => {
  // dialog to upload
  dialog.showOpenDialog({
    title: 'Choose your files',
    filters: [
      { name: 'IGC', extensions: ['igc'] },
    ],
    properties: ['openFile', 'multiSelections'],
  }).then(async (data) => {
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
        event.reply('getIgcFileProgress', {
          index: i,
          length: data.filePaths.length,
        });
        i += 1;
      }
    }

    // notification end
    event.reply('getIgcFileResult', lastData);
  });
});
