const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const xlsx = require('xlsx');

const basePath = app.isPackaged ? path.dirname(process.execPath) : __dirname;

let win;
let watcher;
let cachedData = { emailData: [], contactData: [] };

const readSheet = (filePath, options) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet, options);
};

const loadExcelFiles = () => {
  try {
    const groupsPath = path.join(basePath, 'groups.xlsx');
    const contactsPath = path.join(basePath, 'contacts.xlsx');

    const emailData = readSheet(groupsPath, { header: 1 });
    const contactData = readSheet(contactsPath);

    cachedData = { emailData, contactData };
  } catch (err) {
    console.error('Error reading Excel files:', err);
    cachedData = { emailData: [], contactData: [] };
  }
};

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(basePath, 'icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    win.loadURL('http://localhost:5173/');
  }

  win.once('ready-to-show', () => {
    win.show();
  });
};

const handleFileChange = (filePath) => {
  console.log(`File changed: ${filePath}`);
  loadExcelFiles();
  win.webContents.send('excel-data-updated', cachedData);
};

const initWatcher = () => {
  const files = ['groups.xlsx', 'contacts.xlsx'].map((file) =>
    path.join(basePath, file)
  );
  watcher = chokidar.watch(files, {
    persistent: true,
    ignoreInitial: true,
  });
  watcher.on('change', handleFileChange);
  watcher.on('add', handleFileChange);
};

app.whenReady().then(() => {
  createWindow();
  loadExcelFiles();
  initWatcher();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  if (watcher) {
    watcher.close();
  }
});

ipcMain.on('load-excel-data', (event) => {
  loadExcelFiles();
  event.returnValue = cachedData;
});

ipcMain.on('open-excel-file', (_event, filename) => {
  const filePath = path.join(basePath, filename);
  if (fs.existsSync(filePath)) {
    shell.openPath(filePath);
  }
});

ipcMain.handle('open-external-link', async (_event, url) => {
  if (url) {
    await shell.openExternal(url);
  }
});
