const {
  dialog, ipcMain, app, BrowserWindow,
} = require('electron');// eslint-disable-line

const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');

const {
  newTag,
  removeTagById,
  traces,
  traceById,
  openFile,
  getLast,
  saveTrace,  
} = require('./ipc');

const { start } = require('./db/repo');

let mainWindow;

const createWindow = async () => {
  // create db and init
  await start();
  const store = new Store();

  const windowsSize = store.get('window_size');

  // create browser
  mainWindow = new BrowserWindow({
    width: windowsSize && windowsSize.width || 900,
    height: windowsSize && windowsSize.height || 680,
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
  mainWindow.on('resize', () => {
    const { width, height, } = mainWindow.getBounds();
    store.set('window_size', {
      width,
      height,
    });
  });

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

ipcMain.on('getIgcById', traceById);

ipcMain.on('addNewTag', newTag);

ipcMain.on('saveTrace', saveTrace);

ipcMain.on('removeTagById', removeTagById);

ipcMain.on('getLast', getLast);

ipcMain.on('addIgcFileAsk', (event) => {
  // dialog to upload
  dialog.showOpenDialog({
    title: 'Choose your files',
    filters: [
      { name: 'IGC', extensions: ['igc'] },
    ],
    properties: ['openFile'],
  }).then((d) => {
    const path = d && d.filePaths && d.filePaths.length > 0 && d.filePaths[0];
    openFile(event)({
      path,
    });
  });
});
