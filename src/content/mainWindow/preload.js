// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const customTitlebar = require('custom-electron-titlebar');
const {remote} = require('electron')
const openAboutWindow = require('about-window').default
const log = require('electron-log')
log.mainWindow = log.scope('Main')
const {devMode} = remote.require('./functions/checkParams.js')
const keyShorts = require('./keyboardShortcut.js')
const fs = require('fs')

document.addEventListener('DOMContentLoaded', () => {
  // It does not make sense to use the custom titlebar on macOS where
  // it only tries to simulate what we get with the normal behavior anyway.
  if (process.platform != 'darwin') {

    // add a menu
    const menu = new remote.Menu();
    menu.append(new remote.MenuItem({
      label: 'File',
      submenu: [{
        label: 'Open website',
        accelerator: process.platform === 'darwin' ? 'Command+M' : 'Ctrl+M',	
        click(){
          keyShorts.openWebsite()
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
      }]
    }));

    menu.append(new remote.MenuItem({
      label: 'Help',
      submenu: [{
        label: 'About',
        click(){
          log.mainWindow.verbose("About called")
          var aboutWindow = openAboutWindow({
          icon_path: `${__dirname}/icon.png`,
          product_name: 'Arendelle Odyssey',
          description: `The Arendelle Odyssey App`,
          homepage: 'https://github.com/ArendelleOdyssey/desktop-app',
          license: 'GPL-3.0',
          use_version_info: true,
          adjust_window_size: false,
          use_inner_html: true,
          bug_report_url: devMode?'https://gist.githubusercontent.com/GreepTheSheep/f468c9ccd2d47c8ce294d7ef395dfd2e/raw/d6c5f631b9e5b336df9585d39e01cffdc70bfae8/find-it-yourself':'https://github.com/ArendelleOdyssey/desktop-app/issues',
          bug_link_text: '🐛 Found bug?',
          open_devtools: false,
          win_options: {
              show: false,
              maximizable: false,
              resizable: false,
              minimizable: false,
              alwaysOnTop: true,
              parent: remote.getCurrentWindow()
          }
          });
          aboutWindow.setTitle('About Arendelle Odyssey')
          aboutWindow.on('ready-to-show', () =>{
          aboutWindow.show()
          })
        }
      }]
    }));

    if (devMode) {
      menu.append(new remote.MenuItem({
        label: 'Developer Mode',
        submenu: [{
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',	
          click(){
            keyShorts.toggleDevTools()
          }
        },
        {
          label: 'Open Log Folder',
          click(){
            remote.shell.showItemInFolder(log.transports.file.getFile().path)
          }
        }]
      }));
      
      menu.append(new remote.MenuItem({
        label: 'Test',
        submenu: [{
          label: 'Open a window',	
          click(){
            log.verbose('a window will appear!')
            const win = new remote.BrowserWindow({
              show : false,
              //backgroundColor: '#000F42',
              icon: 'build/icon.png',
              title: 'Arendelle Odyssey',
              // parent: remote.getCurrentWindow(),
              webPreferences: {
                enableRemoteModule: true,
                nodeIntegration: true,
              }
            })
        
            win.setMenu(null);
        
            // and load the index.html of the app.
            //win.loadFile('content/win/index.html')
            win.loadURL(`file://${__dirname}/index.html`)
        
            // Open the DevTools.
            //win.webContents.openDevTools()
          
            win.on('ready-to-show', () => {
              win.show()
            })
          }
        }]
      }));
    }

    const titlebar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#000F42'),
        icon: './icon.png',
        menu
    });
    titlebar.updateTitle(`${devMode?'👨‍💻 ':''}Arendelle Odyssey`);

    keyShorts.initKeys()
    keyShorts.konami()
  }
})

document.addEventListener('readystatechange', () => {

  if (document.readyState == 'interactive'){
    var head = document.getElementsByTagName('head')[0];
    var sty = document.createElement('style');
    sty.type = 'text/css';
    var css = fs.readFileSync(__dirname+'/renderStyle.css', 'utf-8')
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