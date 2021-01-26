const { app, BrowserWindow, ipcMain } = require('electron')
const log = require('electron-log')
const path = require('path')
const EventEmitter = require('events');
const customWindowEvent = new EventEmitter()
const params = require('./functions/checkParams.js')

log.mainWindow = log.scope('Main');
log.webWindow = log.scope('Website');

var loadWindow = null
var resolved  = false
var webWindow = null

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.whenReady().then(createWindow)
app.on('ready', async () => {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 500,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: false,
    },
    transparent: false,
    backgroundColor: '#252525',
    icon: 'build/icon.png',
    title: 'Loading Arendelle Odyssey',
    frame: false,
    center: true,
    show: false,
    maximizable: false,
    minimizable: false
  });
  loadWindow.loadURL(`file://${__dirname}/content/loadWindow/index.html`)
  loadWindow.setAlwaysOnTop(true); 

  loadWindow.once('ready-to-show', () => {
    loadWindow.show();
  });
  loadWindow.once('close', () =>{
    loadWindow = null
    if (resolved == false) {
      app.quit()
      process.exit(0)
    }
  })

  var contents = loadWindow.webContents
  //contents.openDevTools()
  
  if (params.website) {
    log.info('App started in web mode')
    customWindowEvent.emit('create-web')
    return
  }

  if (params.devMode) {
    log.info('App started in dev mode')
    customWindowEvent.emit('create-main')
  } else {
    require('./functions/autoUpdater.js')(contents, customWindowEvent)
  }
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
      minWidth: 500,
      minHeight: 200,
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
    log.mainWindow.verbose('Window created')

    mainWindow.setMenu(null);
    
    mainWindow.flashFrame(true)
    mainWindow.once('focus', () => mainWindow.flashFrame(false))

    mainWindow.webContents.on('devtools-opened', () => log.mainWindow.verbose('Dev Tools opened'))
    mainWindow.webContents.on('devtools-closed', () => log.mainWindow.verbose('Dev Tools closed'))

    // and load the index.html of the app.
    //mainWindow.loadFile('content/mainWindow/index.html')
    mainWindow.loadURL(`file://${__dirname}/content/mainWindow/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow.isVisible() && !mainWindow.isMaximized()) mainWindow.maximize()
    mainWindow.show()
    if (loadWindow != null) loadWindow.close();
  })
  mainWindow.on('close', () => {
    log.mainWindow.verbose('Window closed')
  })
})

ipcMain.on('open-website', () => {
  customWindowEvent.emit('create-web')
})

customWindowEvent.on('create-web', ()=>{
  resolved = true
  if (webWindow != null) {
    log.webWindow.verbose('Window focused')
    webWindow.focus()
  } else {
    log.webWindow.verbose('Window created')
    const aodns = 'arendelleodyssey.com'
    webWindow = new BrowserWindow({
      minWidth: 500,
      minHeight: 200,
      show : false,
      backgroundColor: '#000F42',
      icon: 'build/icon.png',
      title: 'Arendelle Odyssey',
      frame: process.platform == 'darwin',
      titleBarStyle: "hidden",
      webPreferences: {
        enableRemoteModule: true,
        preload: path.join(__dirname, 'content', 'websiteWindow', 'preload.js'),
        nodeIntegration: true,
      }
    })
    webWindow.setMenu(null);
    
    webWindow.flashFrame(true)
    webWindow.once('focus', () => webWindow.flashFrame(false))

    webWindow.loadURL('https://'+aodns)

    if (!webWindow.isMaximized()) webWindow.maximize()

    webWindow.webContents.on('new-window', function(e, url) {
      log.webWindow.info(`New window to ${url} opened in browser`)
      e.preventDefault();
      require('electron').shell.openExternal(url);
    });
    
    webWindow.webContents.on('will-navigate', (e, url) => {
      if (!url.includes(aodns) || url.includes('wp.com')){
        e.preventDefault();
        require('electron').shell.openExternal(url);
        log.webWindow.info(`Navigate to ${url} opened in browser`)
      } else {
        log.webWindow.info(`Navigate to ${url}`)
      }
    })

    webWindow.on('ready-to-show', () => {
      webWindow.show()
      if (loadWindow != null) loadWindow.close();
    })

    webWindow.on('close', () => {
      webWindow = null
      log.webWindow.verbose('Window closed')
    })
  }
})