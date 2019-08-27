const {
  dialog, ipcMain, app, BrowserWindow,
} = require('electron');// eslint-disable-line

const path = require('path');
const isDev = require('electron-is-dev');
const IGCAnalyzer = require('igc-analyzer');
const fs = require('fs');

const startDb = require('./db/start');

let mainWindow;
let db;

const createWindow = () => {
  // create db
  startDb().then((dbTmp) => {
    db = dbTmp;
  });

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

ipcMain.on('getIgcFileAsk', (event) => {
  dialog.showOpenDialog({
    title: 'Choose your files',
    filters: [
      { name: 'IGC', extensions: ['igc'] },
    ],
    properties: ['openFile', 'multiSelections'],
  }).then((data) => {
    let lastData;
    if (data && data.filePaths && data.filePaths.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const filePathTmp of data.filePaths) {
        console.log('filePath', filePathTmp);
        const igcData = fs.readFileSync(filePathTmp);
        const analyzer = new IGCAnalyzer(igcData);
        lastData = analyzer.parse(true, true);
      }
    }

    event.reply('getIgcFileResult', lastData);
  });
});
