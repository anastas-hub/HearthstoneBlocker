const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  startBlock: () => ipcRenderer.invoke('start-block'),
  getDuration: () => ipcRenderer.invoke('getDuration'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  onBlockEnded: (callback) => ipcRenderer.on('block-ended', callback),
});
