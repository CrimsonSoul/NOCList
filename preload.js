const { contextBridge, ipcRenderer } = require('electron');

const api = {
  loadExcelData: () => ipcRenderer.sendSync('load-excel-data'),
  openFile: (filename) => ipcRenderer.send('open-excel-file', filename),
  onExcelDataUpdate: (callback) =>
    ipcRenderer.on('excel-data-updated', (_event, data) => callback(data)),
  openExternal: (url) => ipcRenderer.invoke('open-external-link', url),
};

contextBridge.exposeInMainWorld('nocListAPI', api);
