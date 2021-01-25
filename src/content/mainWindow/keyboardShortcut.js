const mousetrap = require('mousetrap')
const remote = require('electron').remote
const log = require('electron-log')
log.mainWindow = log.scope('Main')
const {ipcRenderer} = require('electron')

function toggleDevTools(){
    remote.getCurrentWebContents().toggleDevTools()
}
function openWebsite(){
    log.mainWindow.verbose('Website window called')
    ipcRenderer.send('open-website')
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