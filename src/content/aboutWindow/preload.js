const customTitlebar = require('custom-electron-titlebar');
const {remote} = require('electron')

document.addEventListener('DOMContentLoaded', () => {
  // It does not make sense to use the custom titlebar on macOS where
  // it only tries to simulate what we get with the normal behavior anyway.
  if (process.platform != 'darwin') {

    // add a menu
    const menu = new remote.Menu();

    const titlebar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#000F42'),
        icon: '../mainWindow/icon.png',
        menu,
        maximizable: false,
        minimizable: false,
    });
    titlebar.updateTitle('About Arendelle Odyssey');
  }
})

document.addEventListener('readystatechange', () => {

    if (document.readyState == 'interactive'){
      var head = document.getElementsByTagName('head')[0];
      var sty = document.createElement('style');
      sty.type = 'text/css';
      var css = `
        @font-face {
          font-family: ice-kingdom;
          src: url(../libs/ice-kingdom.woff2);
        }
        .titlebar{
          z-index: 999999;
          font-family: ice-kingdom;
        }
        .container-after-titlebar{
            text-align: center;
        }
        .logo, .versions{
            margin-left:auto;
            margin-right:auto;
        }
        ` // You can compress all css files you need and put here
      if (sty.styleSheet){
        sty.styleSheet.cssText = css;
      } else {
        sty.appendChild(document.createTextNode(css));
      }
      head.appendChild(sty);
    }
  });

/*global document*/
/*eslint no-undef: "error"*/