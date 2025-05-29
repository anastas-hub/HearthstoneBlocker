const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { blockFirewall, unblockFirewall, loadConfig } = require('./firewall');

let win;

function createWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const winWidth = 200;
  const winHeight = 150;

  win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: 0,
    y: screenHeight - winHeight,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    alwaysOnTop: true,
    alwaysOnTopLevel: 'screen-saver',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    resizable: false
  });

  win.loadFile('renderer/index.html');
  setInterval(() => {
    if (!win.isDestroyed()) {
      win.setAlwaysOnTop(true, 'screen-saver');
      win.focus();
      win.show();
    }
  }, 500);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('start-block', async () => {
  try {
    const { duration } = loadConfig();
    blockFirewall();
    setTimeout(() => {
      unblockFirewall();
      if (win && !win.isDestroyed()) {
        win.webContents.send('block-ended');
      }
    }, duration * 1000);
  } catch (error) {
    console.error('Erreur dans start-block:', error);
  }
});

ipcMain.handle('close-window', () => {
  if (win) win.close();
});


