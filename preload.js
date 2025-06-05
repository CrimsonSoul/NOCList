const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('fortnocAPI', {
  loadExcelData: () => ipcRenderer.sendSync('load-excel-data'),
  openFile: (filename) => ipcRenderer.send('open-excel-file', filename),
  onExcelDataUpdate: (callback) => ipcRenderer.on('excel-data-updated', (_, data) => callback(data))
})
