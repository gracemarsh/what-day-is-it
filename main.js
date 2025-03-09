const { app, BrowserWindow, Tray, Menu, screen, nativeImage, ipcMain } = require('electron');
const path = require('path');

// Add hot reload for development
try {
  require('electron-reloader')(module, {
    watchRenderer: true,
    ignore: ['node_modules/**', 'dist/**']
  });
  console.log('Hot reload enabled');
} catch (err) {
  console.log('Error enabling hot reload:', err);
}

// Keep a global reference of the window object to avoid it being garbage collected
let mainWindow;
let tray;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Calculate appropriate window size
  const defaultSize = Math.floor(width / 10); // 1/10 of screen width
  const maxSize = Math.floor(height * 0.5); // 50% of screen height
  const windowSize = Math.min(defaultSize, maxSize);
  
  mainWindow = new BrowserWindow({
    width: windowSize,
    height: windowSize,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false, // Keep frameless for our custom title bar
    resizable: true,
    transparent: false,
    alwaysOnTop: false,
    minWidth: 200,
    minHeight: 200,
    maxWidth: maxSize,
    maxHeight: maxSize
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Ensure window stays square when resized, but not bigger than maxSize
  mainWindow.on('resize', () => {
    const size = mainWindow.getSize();
    const square = Math.min(Math.max(size[0], size[1]), maxSize);
    mainWindow.setSize(square, square);
  });

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

// Setup IPC handlers for window controls
function setupIPC() {
  // Handle minimize button click
  ipcMain.on('minimize-window', () => {
    if (mainWindow) mainWindow.minimize();
  });

  // Handle maximize/restore button click
  ipcMain.on('maximize-window', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        // Ensure we maintain our square ratio and max size when maximizing
        const { height } = screen.getPrimaryDisplay().workAreaSize;
        const maxSize = Math.floor(height * 0.5);
        mainWindow.setSize(maxSize, maxSize);
      }
    }
  });

  // Handle close button click
  ipcMain.on('close-window', () => {
    if (mainWindow) mainWindow.hide();
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
  setupIPC();
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
