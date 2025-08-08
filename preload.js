const { contextBridge, ipcRenderer } = require('electron')

/**
 * Safely expose a minimal API surface to the renderer process.
 */
contextBridge.exposeInMainWorld('nocListAPI', {
  /**
   * Load Excel data synchronously from the main process.
   * @returns {{emailData: any[], contactData: any[]}}
   */
  loadExcelData: () => ipcRenderer.sendSync('load-excel-data'),

  /**
   * Ask the main process to open an Excel file.
   * @param {string} filename
   */
  openFile: (filename) => ipcRenderer.send('open-excel-file', filename),

  /**
   * Listen for automatic Excel data updates.
   * @param {(data: {emailData: any[], contactData: any[]}) => void} callback
   */
  onExcelDataUpdate: (callback) =>
    ipcRenderer.on('excel-data-updated', (_, data) => callback(data)),

  /**
   * Open an external URL in the user's default browser.
   * @param {string} url
   */
  openExternal: (url) => ipcRenderer.invoke('open-external-link', url),
})
