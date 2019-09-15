const {
  dialog, ipcMain, app, BrowserWindow,
} = require('electron');// eslint-disable-line

const path = require('path');
const isDev = require('electron-is-dev');

const {
  newTag,
  removeTagById,
  traces,
  traceById,
  traceLast,
  openFile,
} = require('./ipc');
const { start } = require('./db/repo');

let mainWindow;

const createWindow = async () => {
  // create db and init
  await start();

  // create browser
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.setMenuBarVisibility(false);

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

ipcMain.on('getIgcFiles', traces);

ipcMain.on('getIgcLast', traceLast);

ipcMain.on('getIgcById', traceById);

ipcMain.on('addNewTag', newTag);

ipcMain.on('removeTagById', removeTagById);

ipcMain.on('addIgcFileAsk', (event) => {
  // dialog to upload
  dialog.showOpenDialog({
    title: 'Choose your files',
    filters: [
      { name: 'IGC', extensions: ['igc'] },
    ],
    properties: ['openFile'],
  }).then((d) => openFile(event)(d));
});
