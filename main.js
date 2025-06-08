const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', async () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Prüfen, ob sich der Dev-Server laden lässt
  const devServerURL = 'http://localhost:5173';
  try {
    await mainWindow.loadURL(devServerURL);
  } catch (err) {
    console.error(`Failed to load URL: ${devServerURL}`, err);
  }
});
