const { app, BrowserWindow, ipcMain } = require('electron')
const log = require('electron-log')
console.log(log.transports.file.getFile().path)
const path = require('path')
const EventEmitter = require('events');
const customWindowEvent = new EventEmitter()

var closeLoadWindow
var loadWindow
var resolved

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.whenReady().then(createWindow)
app.on('ready', async () => {
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

  var contents = loadWindow.webContents
  //contents.openDevTools()
  //await wait(5000)

  require('./autoUpdater.js')(contents, customWindowEvent)
  
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
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log.info('Goodbye!')
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      customWindowEvent.emit('create-main')
    }
})

customWindowEvent.on('create-main', ()=>{
  resolved = true
  // Create the browser window.
    const mainWindow = new BrowserWindow({
      show : false,
      //backgroundColor: '#000F42',
      icon: 'build/icon.png',
      title: 'Arendelle Odyssey',
      frame: process.platform == 'darwin',
      titleBarStyle: "hidden",
      webPreferences: {
        enableRemoteModule: true,
        preload: path.join(__dirname, 'content', 'mainWindow', 'preload.js'),
        nodeIntegration: true,
      }
    })
    log.mainWindow = log.scope('Main');
    log.mainWindow.verbose('Main window called')
    
    mainWindow.setMenu(null);
    
    mainWindow.flashFrame(true)
    mainWindow.once('focus', () => mainWindow.flashFrame(false))

    mainWindow.webContents.on('devtools-opened', () => log.mainWindow.verbose('Dev Tools opened'))
    mainWindow.webContents.on('devtools-closed', () => log.mainWindowg.verbose('Dev Tools closed'))
    
    // and load the index.html of the app.
    //mainWindow.loadFile('content/mainWindow/index.html')
    mainWindow.loadURL(`file://${__dirname}/content/mainWindow/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow.isMaximized()) mainWindow.maximize()
    mainWindow.show()
    if (loadWindow != null) loadWindow.close();
  })
})

