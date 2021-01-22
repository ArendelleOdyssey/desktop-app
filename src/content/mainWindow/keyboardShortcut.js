const mousetrap = require('mousetrap')
const remote = require('electron').remote

function toggleDevTools(){
    remote.getCurrentWebContents().toggleDevTools()
}

module.exports = {
    toggleDevTools: () => toggleDevTools(),
    initKeys: () => {
        mousetrap.bind(['alt+command+i', 'ctrl+shift+i'], () =>{
            toggleDevTools()
        })
        mousetrap.bind(['command+r', 'ctrl+r'], () =>{
            window.location.reload(true)
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