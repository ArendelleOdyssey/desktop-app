const { autoUpdater } = require("electron-updater")
autoUpdater.checkForUpdatesAndNotify() // we need to update only on loading window
const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron")
const path = require('path')
// require('@treverix/remote/main').initialize() // for the custom titlebar (even on the web app)

var mainWindow = null
var loadWindow = null
var resolved

app.on('ready', async () => createLoadWindow());
  
ipcMain.on('online', () => {
    resolved = true
    createMainWindow();
})

function createLoadWindow(){
    loadWindow = new BrowserWindow({
        width: 400,
        height: 500,
        webPreferences: {
          enableRemoteModule: true,
          preload: path.join(__dirname, 'content', 'loadWindow', 'preload.js'),
          nodeIntegration: false,
        },
        transparent: false,
        backgroundColor: '#252525',
        icon: 'build/icon.png',
        title: 'Loading Arendelle Odyssey',
        frame: false,
        center: true,
        show: false
      });
      loadWindow.loadFile(path.join(__dirname, 'content', 'loadWindow', 'index.html'))
      loadWindow.setAlwaysOnTop(true); 
      loadWindow.once('ready-to-show', () => {
        loadWindow.show();
        resolved = false
      });
      var checkMaximize = setInterval(() => {
        if (loadWindow != null) loadWindow.unmaximize()
        else clearInterval(checkMaximize)
      }, 0)
    
      //loadWindow.webContents.openDevTools()
      //await wait(5000)
    
      loadWindow.once('close', () =>{
        loadWindow = null
        if (resolved == false) {
          app.quit()
          process.exit(0)
        }
      })
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        backgroundColor: '#000F42',
        icon: 'build/icon.png',
        title: 'Arendelle Odyssey',
        frame: process.platform == 'darwin',  // the custom titlebar is useless on mac os
        webPreferences: {
            enableRemoteModule: true,
            preload: path.join(__dirname, 'content', 'mainWindow', 'preload.js'),
            nodeIntegration: false
        }
    })
    mainWindow.loadFile(path.join(__dirname, 'content', 'mainWindow', 'index.html'))
    mainWindow.setMenu(null)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (loadWindow != null) loadWindow.close();
    });
    mainWindow.flashFrame(true)
    mainWindow.once('focus', () => mainWindow.flashFrame(false))
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})