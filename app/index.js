import electron from 'electron';
import { app, BrowserWindow } from 'electron';
import path from 'path';

// Keep a global reference of the window object, if not the window might be
// closed automatically when the JavaScript object is garbage-collected
let mainWindow = null;

// Setup takes care of all tasks needed to create or reload the app
function setup() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1000,
    minWidth: 600,
    height: 800,
    minHeight: 500,
    backgroundColor: '#202225'
  });

  // Load main HTML-file into browserwindow
  const HTMLPath = path.join(__dirname, 'index.html');
  mainWindow.loadURL(HTMLPath);
  // Remove the top-menu from the window (file, help etc.)
  mainWindow.setMenu(null);

  // Window is initialized to not show to avoid app bg from flashing on startup
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    //mainWindow.openDevTools();
  });

  // Dereference window variable when window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Called when Electron has finished initialization and is ready to create
// browser windows. Some APIs can only be used after this event occurs
app.on('ready', () => {
  setup();
});

// Quit app when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});