const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const xlsx = require('xlsx');

const basePath = app.isPackaged ? path.dirname(process.execPath) : __dirname;
const GROUPS_FILE = 'groups.xlsx';
const CONTACTS_FILE = 'contacts.xlsx';

let win
let watcher
let cachedData = { emailData: [], contactData: [] }

function loadExcelFiles(file) {
  try {
    if (file === 'groups' || !file) {
      const groupsPath = path.join(basePath, GROUPS_FILE);
      const groupWorkbook = xlsx.readFile(groupsPath);
      const groupSheet = groupWorkbook.Sheets[groupWorkbook.SheetNames[0]];
      cachedData.emailData = xlsx.utils.sheet_to_json(groupSheet, { header: 1 });
    }
    if (file === 'contacts' || !file) {
      const contactsPath = path.join(basePath, CONTACTS_FILE);
      const contactWorkbook = xlsx.readFile(contactsPath);
      const contactSheet = contactWorkbook.Sheets[contactWorkbook.SheetNames[0]];
      cachedData.contactData = xlsx.utils.sheet_to_json(contactSheet);
    }
  } catch (err) {
    console.error(`Error reading ${file || 'Excel'} file:`, err);
    if (file === 'groups' || !file) cachedData.emailData = [];
    if (file === 'contacts' || !file) cachedData.contactData = [];
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(basePath, 'icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false
    }
  })

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'))
  } else {
    win.loadURL('http://localhost:5173/')
  }

  win.once('ready-to-show', () => {
    win.show()
  })
}

app.whenReady().then(() => {
  createWindow();
  loadExcelFiles();

  const groupsPath = path.join(basePath, GROUPS_FILE);
  const contactsPath = path.join(basePath, CONTACTS_FILE);

  watcher = chokidar.watch([groupsPath, contactsPath], {
    persistent: true,
    ignoreInitial: true,
  });

  const onChange = (filePath) => {
    console.log(`File changed: ${filePath}`);
    const file = filePath.includes('groups') ? 'groups' : 'contacts';
    loadExcelFiles(file);
    win.webContents.send('excel-data-updated', cachedData);
  };

  watcher.on('change', onChange);
  watcher.on('add', onChange);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  if (watcher) {
    watcher.close()
  }
})

ipcMain.on('load-excel-data', (event) => {
  event.returnValue = cachedData;
});

ipcMain.on('open-excel-file', (event, filename) => {
  const filePath = path.join(basePath, filename)
  if (fs.existsSync(filePath)) {
    shell.openPath(filePath)
  }
})

ipcMain.handle('open-external-link', async (_event, url) => {
  if (url) {
    await shell.openExternal(url);
  }
});

ipcMain.handle('check-file-exists', async (_event, filename) => {
  const filePath = path.join(basePath, filename);
  return fs.existsSync(filePath);
});
