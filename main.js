const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { blockFirewall, unblockFirewall } = require('./firewall');
const fs = require('fs');

let currentPhase = 'unknown';
let lastOffset = 0;
let lastFolder = null;

const logsRoot = 'C:\\Program Files (x86)\\Hearthstone\\Logs';
const tagChangeRegex = /tag=STEP value=(\w+)/;

function detectPhaseFromLine(line) {
  const match = tagChangeRegex.exec(line);
  if (!match) return null;
  switch (match[1]) {
    case 'BEGIN_MULLIGAN': return 'lobby';
    case 'MAIN_READY':
    case 'MAIN_ACTION': return 'tavern';
    case 'MAIN_START': return 'combat';
    default: return 'unknown';
  }
}

function findLatestLogFilePath() {
  const folders = fs.readdirSync(logsRoot)
    .map(name => {
      const fullPath = path.join(logsRoot, name);
      const stat = fs.statSync(fullPath);
      return stat.isDirectory() ? { name, time: stat.mtime.getTime() } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.time - a.time);

  if (folders.length === 0) return null;
  return path.join(logsRoot, folders[0].name, 'Power.log');
}

function shouldUpdatePhase(newPhase) {
  if (!newPhase || newPhase === currentPhase) return false;
  currentPhase = newPhase;
  return true;
}

function watchPowerLog(win) {
  setInterval(() => {
    const latestLogFilePath = findLatestLogFilePath();
    if (!latestLogFilePath || !fs.existsSync(latestLogFilePath)) {
      win.webContents.send('log-status', 'not-found');
      return;
    }

    const folder = path.dirname(latestLogFilePath);
    if (folder !== lastFolder) {
      lastFolder = folder;
      win.webContents.send('log-status', 'new-folder');
      lastOffset = 0;
    } else {
      win.webContents.send('log-status', 'found');
    }

    const stats = fs.statSync(latestLogFilePath);
    if (stats.size < lastOffset) lastOffset = 0;

    const stream = fs.createReadStream(latestLogFilePath, {
      encoding: 'utf8',
      start: lastOffset
    });

    let buffer = '';
    stream.on('data', chunk => buffer += chunk);
    stream.on('end', () => {
      const lines = buffer.split('\n');
      for (const line of lines) {
        const phase = detectPhaseFromLine(line);
        if (shouldUpdatePhase(phase)) {
          win.webContents.send('phase', phase);
        }
      }
      lastOffset = stats.size;
    });
  }, 1000);
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, height } = primaryDisplay.bounds; // Prend les coordonnées absolues
  const winWidth = 200;
  const winHeight = 200;

  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: x,  // gauche (0)
    y: y + height - winHeight - 110, // bas (total écran - hauteur fenêtre)
    resizable: false,
    alwaysOnTop: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('renderer/index.html');
  watchPowerLog(win);

  // Boucle pour vraiment forcer "always on top" (niveau maximal)
  setInterval(() => {
    if (win && !win.isDestroyed()) {
      win.setAlwaysOnTop(true, 'screen-saver');
    }
  }, 5000);
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

ipcMain.handle('block-hearthstone', async () => {
  console.log("🟡 Requête de blocage reçue depuis renderer.");
  await blockFirewall();
  setTimeout(() => {
    console.log("🕓 Déblocage automatique après 4 secondes.");
    unblockFirewall();
  }, 1500);
});

ipcMain.on('skip', () => {
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('led-red', 4000);
  });
});

// Ajout fermeture sur bouton custom
ipcMain.on('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) window.close();
});
