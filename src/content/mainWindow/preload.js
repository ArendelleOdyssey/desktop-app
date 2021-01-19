// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const customTitlebar = require('custom-electron-titlebar');
const {remote} = require('electron')
const openAboutWindow = require('about-window').default
const log = require('electron-log')
const path = require('path')

document.addEventListener('DOMContentLoaded', () => {
  // It does not make sense to use the custom titlebar on macOS where
  // it only tries to simulate what we get with the normal behavior anyway.
  if (process.platform != 'darwin') {

    // add a menu
    const menu = new remote.Menu();
    menu.append(new remote.MenuItem({
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click(){
            log.verbose("About called")
            var aboutWindow = openAboutWindow({
              icon_path: `${__dirname}/icon.png`,
              product_name: 'Arendelle Odyssey',
              description: "The Arendelle Odyssey App",
              homepage: 'https://arendelleodyssey.com',
              license: 'GPL-3.0',
              use_version_info: true,
              adjust_window_size: false,
              use_inner_html: true,
              bug_report_url: 'https://github.com/ArendelleOdyssey/desktop-app/issues',
              bug_link_text: '🐛 Found bug?',
              open_devtools: false,
              win_options: {
                frame: process.platform == 'darwin',
                titleBarStyle: "hidden",
                webPreferences: {
                  enableRemoteModule: true,
                  preload: path.join(__dirname, '..', 'aboutWindow', 'preload.js'),
                  nodeIntegration: true,
                }
              }
            });
            aboutWindow.setMaximumSize(416,439)
            aboutWindow.setMinimumSize(416,439)
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          click(){
            window.close()
          }
        }
      ]
    }));

    const titlebar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#000F42'),
        icon: './icon.png',
        menu
    });
    titlebar.updateTitle('Arendelle Odyssey');
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
        font-family: arial;
      }
      .window-title{
        font-family: ice-kingdom;
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

/*global document, window*/
/*eslint no-undef: "error"*/