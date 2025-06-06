const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const xlsx = require('xlsx')

let win
let cachedData = { emailData: [], contactData: [] }

function loadExcelFiles() {
  try {
    const groupsPath = path.join(__dirname, 'groups.xlsx')
    const contactsPath = path.join(__dirname, 'contacts.xlsx')

    const groupWorkbook = xlsx.readFile(groupsPath)
    const contactWorkbook = xlsx.readFile(contactsPath)

    const groupSheet = groupWorkbook.Sheets[groupWorkbook.SheetNames[0]]
    const contactSheet = contactWorkbook.Sheets[contactWorkbook.SheetNames[0]]

    const emailData = xlsx.utils.sheet_to_json(groupSheet, { header: 1 })
    const contactData = xlsx.utils.sheet_to_json(contactSheet)

    cachedData = { emailData, contactData }
  } catch (err) {
    console.error('Error reading Excel files:', err)
    cachedData = { emailData: [], contactData: [] }
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false
    }
  })

  win.loadURL('http://localhost:5173/')
}

app.whenReady().then(() => {
  createWindow()
  loadExcelFiles()

  const groupsPath = path.join(__dirname, 'groups.xlsx')
  const contactsPath = path.join(__dirname, 'contacts.xlsx')

  [groupsPath, contactsPath].forEach(filePath => {
    fs.watchFile(filePath, { interval: 1000 }, () => {
      console.log(`File changed: ${filePath}`)
      loadExcelFiles()
      win.webContents.send('excel-data-updated', cachedData)
    })
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('load-excel-data', (event) => {
  event.returnValue = cachedData
})

ipcMain.on('open-excel-file', (event, filename) => {
  const filePath = path.join(__dirname, filename)
  if (fs.existsSync(filePath)) {
    shell.openPath(filePath)
  }
})

ipcMain.handle('open-external-link', async (_event, url) => {
  if (url) {
    await shell.openExternal(url)
  }
})
