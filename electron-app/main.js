const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';
const WEB_URL = isDev ? 'http://localhost:3000' : null;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'SNS Hotels POS',
    icon: path.join(__dirname, 'web', 'icons', 'icon-512x512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0A0E1A',
    show: false,
  });

  // Remove default menu in production
  if (!isDev) Menu.setApplicationMenu(null);

  // Load app
  if (WEB_URL) {
    win.loadURL(WEB_URL);
  } else {
    const indexHtml = path.join(__dirname, 'web', 'index.html');
    if (fs.existsSync(indexHtml)) {
      win.loadFile(indexHtml);
    } else {
      // Fallback if index.html is missing - try the server or our download page
      win.loadURL('https://pos.snshotels.com');
    }
  }

  win.once('ready-to-show', () => win.show());

  // Open external links in system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });
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
