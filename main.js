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

const DEBOUNCE_DELAY = 250

/**
 * Simple debounce helper to limit how often a function can run.
 */
function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Resolve file paths for the Excel spreadsheets.
 */
const getExcelPaths = () => ({
  groupsPath: path.join(basePath, 'groups.xlsx'),
  contactsPath: path.join(basePath, 'contacts.xlsx'),
})

/**
 * Read Excel sheets and cache the parsed data for quick access.
 */
function loadExcelFiles() {
  try {
    const { groupsPath, contactsPath } = getExcelPaths()

    const groupWorkbook = xlsx.readFile(groupsPath)
    const contactWorkbook = xlsx.readFile(contactsPath)

    const groupSheet = groupWorkbook.Sheets[groupWorkbook.SheetNames[0]]
    const contactSheet = contactWorkbook.Sheets[contactWorkbook.SheetNames[0]]

    cachedData = {
      emailData: xlsx.utils.sheet_to_json(groupSheet, { header: 1 }),
      contactData: xlsx.utils.sheet_to_json(contactSheet),
    }
  } catch (err) {
    console.error('Error reading Excel files:', err)
    cachedData = { emailData: [], contactData: [] }
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
function watchExcelFiles(testWatcher) {
  const { groupsPath, contactsPath } = getExcelPaths()

  watcher = testWatcher || chokidar.watch([groupsPath, contactsPath], {
    persistent: true,
    ignoreInitial: true,
  })

  const debouncedOnChange = debounce((filePath) => {
    console.log(`File changed: ${filePath}`)
    loadExcelFiles()
    sendExcelUpdate()
  }, DEBOUNCE_DELAY)

  const debouncedOnUnlink = debounce((filePath) => {
    console.log(`File deleted: ${filePath}`)
    cachedData = { emailData: [], contactData: [] }
    sendExcelUpdate()
  }, DEBOUNCE_DELAY)

  const onError = (error) => {
    console.error('Watcher error:', error)
    if (win?.webContents) {
      win.webContents.send('excel-watch-error', error.message || String(error))
    }
  }

  watcher.on('change', debouncedOnChange)
  watcher.on('add', debouncedOnChange)
  watcher.on('unlink', debouncedOnUnlink)
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

  ipcMain.handle('load-excel-data', async () => cachedData)

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
  __setWin: (w) => (win = w),
  __setCachedData: (data) => (cachedData = data),
  getCachedData: () => cachedData,
  __testables: { loadExcelFiles, sendExcelUpdate },
}
