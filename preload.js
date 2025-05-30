const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  blockHearthstone: (duration) => ipcRenderer.invoke('block-hearthstone', duration)
});

contextBridge.exposeInMainWorld('api', {
  onPhaseChanged: (cb) => ipcRenderer.on('phase', (_, phase) => cb(phase)),
  onLogStatus: (cb) => ipcRenderer.on('log-status', (_, status) => cb(status)),
  onRedLed: (cb) => ipcRenderer.on('led-red', (_, duration) => cb(duration)),
  skip: () => ipcRenderer.send('skip'),
  close: () => ipcRenderer.send('close-window') // ← Ajout ici
});
