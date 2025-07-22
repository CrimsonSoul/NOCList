const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('nocListAPI', {
  loadExcelData: () => ipcRenderer.sendSync('load-excel-data'),
  openFile: (filename) => ipcRenderer.send('open-excel-file', filename),
  onExcelDataUpdate: (callback) => ipcRenderer.on('excel-data-updated', (_, data) => callback(data)),
  openExternal: (url) => ipcRenderer.invoke('open-external-link', url),
  checkFileExists: (filename) => ipcRenderer.invoke('check-file-exists', filename),
});
