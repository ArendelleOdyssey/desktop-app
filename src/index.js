const { autoUpdater } = require("electron-updater")
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const execArgs = process.argv;
var closeLoadWindow
var loadWindow

function createMainWindow () {
  // Create the browser window.
    const mainWindow = new BrowserWindow({
      show : false,
      //backgroundColor: '#000F42',
      icon: 'build/icon.png',
      title: 'Arendelle Odyssey',
      frame: true,
      webPreferences: {
        enableRemoteModule: true,
        preload: path.join(__dirname, 'content', 'mainWindow', 'preload.js'),
        nodeIntegration: false,
      }
    })
    

    mainWindow.setMenu(null);
    
    mainWindow.flashFrame(true)
    mainWindow.once('focus', () => mainWindow.flashFrame(false))

    // and load the index.html of the app.
    //mainWindow.loadFile('content/mainWindow/index.html')
    mainWindow.loadURL(`file://${__dirname}/content/mainWindow/index.html`)

    //if (!window.isMaximized()) window.maximize()

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow.isMaximized()) mainWindow.maximize()
    mainWindow.show()
    if (loadWindow != null) loadWindow.close();
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.whenReady().then(createWindow)
var resolved
app.on('ready', async () => {
  if (execArgs.includes('--develop') || execArgs.includes('-d')) {
    console.log('Started in develop mode (Updater will not start)')
    return createMainWindow();
  } else {
    resolved = false
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
    loadWindow.loadURL(`file://${__dirname}/content/loadWindow/index.html`)
    loadWindow.setAlwaysOnTop(true); 
    loadWindow.once('ready-to-show', () => {
      loadWindow.show();
    });
    var checkMaximize = setInterval(() => {
      if (loadWindow) loadWindow.unmaximize()
    }, 0)
    closeLoadWindow = () => {
      clearInterval(checkMaximize)
      loadWindow.close();
    };

    //loadWindow.webContents.openDevTools()
    //await wait(5000)

    if (!autoUpdater.app.isPackaged) {
      resolved = true
      createMainWindow();
    } else {
      autoUpdater.checkForUpdates();
    }

    loadWindow.once('close', () =>{
      loadWindow = null
      if (resolved == false) {
        app.quit()
        process.exit(0)
      }
    })

    ipcMain.on('closeLoad', () => {
      if (loadWindow != null) closeLoadWindow()
    })
  }
});

ipcMain.on('online', () => {
  resolved = true
  createMainWindow();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.