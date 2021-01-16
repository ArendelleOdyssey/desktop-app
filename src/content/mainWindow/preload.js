// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const customTitlebar = require('@treverix/custom-electron-titlebar');
var {remote} = require('electron')

document.addEventListener('DOMContentLoaded', () => {
  // It does not make sense to use the custom titlebar on macOS where
  // it only tries to simulate what we get with the normal behavior anyway.
  if (process.platform != 'darwin') {

    const menu = new remote.Menu()

    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#000F42'),
        icon: 'build/icon.png',
        menu
    });
  }
})

/*global document*/
/*eslint no-undef: "error"*/