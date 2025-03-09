const { app, BrowserWindow, Tray, Menu, screen, nativeImage } = require('electron');
const path = require('path');

// Keep a global reference of the window object to avoid it being garbage collected
let mainWindow;
let tray;

function createWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  // Set window size to 1/10 of screen width (square)
  const windowSize = Math.floor(width / 10);
  
  mainWindow = new BrowserWindow({
    width: windowSize,
    height: windowSize,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    resizable: true,
    transparent: false,
    alwaysOnTop: false
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Enable right-click to show context menu
  mainWindow.webContents.on('context-menu', (_, params) => {
    Menu.buildFromTemplate([
      { label: 'Close', click: () => mainWindow.hide() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() }
    ]).popup();
  });

  // Handle window being closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create tray icon
function createTray() {
  // Create a simple icon
  const trayIcon = nativeImage.createFromDataURL(`
    data:image/png;base64,
    iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
    AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAA
    B3RJTUUH5gMJBgMbcRIbQQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAKL
    SURBVFjDxZdNSBRhGMd/M7vrfqS7rrq6ppvfWSmEQQmCBFEXL9GhQ3TwVtGhS8c6BXXpElEHCQKJ
    PAQGXQo6CB3Cj7QkUDfTylLTtF1dXff7Y6aDbobMzs7urvt/2Xnf5//+n/d5n+d5RyKRCAk0EUAI
    weE9PXjTnwP3TfpALNMQODJkx9nRnTyAbwK86RAVBRUVHfPOmw3YWFIkuW8dAEouhBPx2BFArVU/
    +d/4dCwzCRLZMQUol8gLARKlYByM+bIjgHLvBYYWl/nS/wUAsljEbrfjS0tFkkCWpNgAANLnJmn+
    +wK5e1rwer0Eg0HsWVkopQXkBQk5uNxY6BHpgY319ROXp8fX7V+bm8UDuIBs4CnWHI/mCyCEwJ3m
    xLnJSUdtLVV1dTQ0NRHwT7ETaNoCFMvkRQDqWnQDmRv3TSYTSUlJcXNAf+RlQHrElnmAXd3d9Kxs
    1oO9vZGXxYsF9a6iLj8CkF1cxLlbtwgOD+P1etc/X1tYoLR8N3/m5ng19J3MKDliUMlRCbCnq4uZ
    wUEcGRnU19cD4Ha7cbvduFwu+h4/ZnJ8nOLKSnKaWzHLsmGlWAXQrn8PnUeP4isrW3dO7nq5zZwk
    0XriBKfPnWNhaIi5gJiPUVYMyhS3oLilJTIaVh9FKQTDYTIVhaq6Oo4fP45bUcixWzAZlyhxvwOz
    LoTQAjwUDpOmKOx0OnGkp6PIIgaVUmdCpRfEGGYhsKZlUF5UQGlxIQXZduwyO3IAY3OBMRMhpACh
    oBFpq0UYlcl0AdR3ywGoK3YbYrLVLt9tZpEaICyhJ2qRRYgmyW2AeATYjH0QYDEIi0Hi1rlhXXCj
    aRnxGjZ8fy3pO6BHCx3aDAH+AW+MX75R5+uyAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTAzLTA5
    VDA2OjAzOjI3KzAwOjAwvlfANQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wMy0wOVQwNjowMzoy
    NyswMDowMM8KeIkAAAAASUVORK5CYII=
  `);
  
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show Calendar', 
      click: () => {
        if (mainWindow === null) {
          createWindow();
        } else {
          mainWindow.show();
        }
      } 
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  
  tray.setToolTip('What Day Is It');
  tray.setContextMenu(contextMenu);
  
  // Double-click on tray icon to show app
  tray.on('double-click', () => {
    if (mainWindow === null) {
      createWindow();
    } else if (!mainWindow.isVisible()) {
      mainWindow.show();
    } else {
      mainWindow.hide();
    }
  });
}

// App ready event
app.whenReady().then(() => {
  createWindow();
  createTray();
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 
