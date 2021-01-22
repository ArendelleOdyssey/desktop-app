const mousetrap = require('mousetrap')
const remote = require('electron').remote
const log = require('electron-log')
const path = require('path')

function toggleDevTools(){
    remote.getCurrentWebContents().toggleDevTools()
}
function openWebsite(){
    log.verbose('Website window called')
    const aodns = 'arendelleodyssey.com'
    var webWindow = new remote.BrowserWindow({
        minWidth: 500,
        minHeight: 200,
        show : false,
        backgroundColor: '#000F42',
        icon: 'build/icon.png',
        title: 'Arendelle Odyssey',
        frame: true,
        webPreferences: {
            enableRemoteModule: true,
            preload: path.join(__dirname, '..', 'websiteWindow', 'preload.js'),
            nodeIntegration: true,
        }
    })
    webWindow.setMenu(null);
    
    webWindow.flashFrame(true)
    webWindow.once('focus', () => webWindow.flashFrame(false))

    webWindow.loadURL('https://'+aodns)

    if (!webWindow.isMaximized()) webWindow.maximize()

    webWindow.webContents.on('new-window', function(e, url) {
        if (!url.includes(aodns)){
            e.preventDefault();
            require('electron').shell.openExternal(url);
        }
    });
    
    webWindow.webContents.on('will-navigate', (e, url) => {
        if (!url.includes(aodns)){
            e.preventDefault();
            require('electron').shell.openExternal(url);
        }
    })

    webWindow.on('ready-to-show', () => {
        webWindow.show()
    })
}

module.exports = {
    toggleDevTools: () => toggleDevTools(),
    openWebsite: () => openWebsite(),
    initKeys: () => {
        mousetrap.bind(['alt+command+i', 'ctrl+shift+i'], () =>{
            toggleDevTools()
        })
        mousetrap.bind(['command+r', 'ctrl+r'], () =>{
            window.location.reload(true)
        })
        mousetrap.bind(['command+m', 'ctrl+m'], () =>{
            openWebsite()
        })
    },
    konami: () => {
        mousetrap.bind('up up down down left right left right enter', () => {
            alert('You knocked in the wrong door')
            window.close()
        })
    }
}


/*global window, alert*/
/*eslint no-undef: "error"*/