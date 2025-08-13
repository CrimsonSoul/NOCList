const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const xlsx = require('xlsx')

// Base directory where Excel files live. In production this is next to the executable.
const basePath = app.isPackaged ? path.dirname(process.execPath) : __dirname

let win
let watcher
let cachedData = { emailData: [], contactData: [] }

/**
 * Resolve file paths for the Excel spreadsheets.
 */
const getExcelPaths = () => ({
  groupsPath: path.join(basePath, 'groups.xlsx'),
  contactsPath: path.join(basePath, 'contacts.xlsx'),
})

/**
 * Read Excel sheets and cache the parsed data for quick access.
 *
 * @param {string} [changedFilePath] - optional full path to a specific Excel
 *   file that has changed. If provided, only that file is re-read and merged
 *   into the cached data.
 */
function loadExcelFiles(changedFilePath) {
  const { groupsPath, contactsPath } = getExcelPaths()

  try {
    if (!changedFilePath || changedFilePath === groupsPath) {
      const groupWorkbook = xlsx.readFile(groupsPath)
      const groupSheet = groupWorkbook.Sheets[groupWorkbook.SheetNames[0]]
      cachedData.emailData = xlsx.utils.sheet_to_json(groupSheet, { header: 1 })
    }
  } catch (err) {
    console.error('Error reading groups file:', err)
    cachedData.emailData = []
  }

  try {
    if (!changedFilePath || changedFilePath === contactsPath) {
      const contactWorkbook = xlsx.readFile(contactsPath)
      const contactSheet = contactWorkbook.Sheets[contactWorkbook.SheetNames[0]]
      cachedData.contactData = xlsx.utils.sheet_to_json(contactSheet)
    }
  } catch (err) {
    console.error('Error reading contacts file:', err)
    cachedData.contactData = []
  }
}

/**
 * Send the latest cached Excel data to the renderer.
 */
function sendExcelUpdate() {
  win.webContents.send('excel-data-updated', cachedData)
}

/**
 * Watch Excel files for changes and notify the renderer when updates occur.
 */
function watchExcelFiles() {
  const { groupsPath, contactsPath } = getExcelPaths()

  watcher = chokidar.watch([groupsPath, contactsPath], {
    persistent: true,
    ignoreInitial: true,
  })

  const onChange = (filePath) => {
    console.log(`File changed: ${filePath}`)
    loadExcelFiles(filePath)
    sendExcelUpdate()
  }

  const onUnlink = (filePath) => {
    console.log(`File deleted: ${filePath}`)
    cachedData = { emailData: [], contactData: [] }
    sendExcelUpdate()
  }

  const onError = (error) => {
    console.error('Watcher error:', error)
    if (win?.webContents) {
      win.webContents.send('excel-watch-error', error.message || String(error))
    }
  }

  watcher.on('change', onChange)
  watcher.on('add', onChange)
  watcher.on('unlink', onUnlink)
  watcher.on('error', onError)
}

/**
 * Create the main browser window.
 */
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

if (process.env.NODE_ENV !== 'test') {
  app.whenReady().then(() => {
    createWindow()
    loadExcelFiles()
    watchExcelFiles()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('will-quit', () => {
    if (watcher) {
      watcher.close()
    }
  })

  ipcMain.on('load-excel-data', (event) => {
    loadExcelFiles()
    event.returnValue = cachedData
  })

  ipcMain.on('open-excel-file', (event, filename) => {
    const filePath = path.join(basePath, filename)
    if (fs.existsSync(filePath)) {
      shell.openPath(filePath)
    }
  })

  ipcMain.handle('open-external-link', async (_event, url) => {
    if (url) {
      await shell.openExternal(url)
    }
  })
}

module.exports = {
  watchExcelFiles,
  loadExcelFiles,
  __setWin: (w) => (win = w),
  __setCachedData: (data) => (cachedData = data),
  getCachedData: () => cachedData,
}
