var {ipcRenderer} = require('electron')
var ping = require('ping');
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
var noConnexionTextChanged = false

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function connexionChecker(){
    ping.sys.probe('arendelleodyssey.com', function(isAlive){
        if (!isAlive){
            document.getElementById('displaytxt').innerText = "No connexion, retrying"
            noConnexionTextChanged = true
        } else {
            if (noConnexionTextChanged == true) document.getElementById('displaytxt').innerText = randomItem(require('./loadingTexts.json'))
            myEmitter.emit('checkUpdates');
        }
    });
}

var connexionCheck = setInterval(connexionChecker, 1000)

myEmitter.on('checkUpdates', () => {
    clearInterval(connexionCheck)

    const { autoUpdater } = require("electron-updater")
    autoUpdater.checkForUpdates();

    autoUpdater.on('checking-for-update', () => {
        document.getElementById('facttxt').innerText = 'Checking for updates...'
    })
    autoUpdater.on('update-available', (info) => {
        //document.getElementById('facttxt').innerText = 'Update available.';
        console.log(info)
    })
    autoUpdater.on('update-not-available', (info) => {
        //document.getElementById('facttxt').innerText = 'Update not available.';
        console.log(info)
        ipcRenderer.send('online');
    })
    autoUpdater.on('error', (err) => {
        document.getElementById('facttxt').innerText = 'Error in auto-updater.'
        console.error(err);
    })
    autoUpdater.on('download-progress', (progressObj) => {
        document.getElementById('facttxt').innerText = `${progressObj.percent}% - ${progressObj.transferred}/${progressObj.total} (${progressObj.bytesPerSecond})`
    })
    autoUpdater.on('update-downloaded', (info) => {
        document.getElementById('facttxt').innerText = 'Update downloaded';
        console.log(info)
        autoUpdater.quitAndInstall();
    });
});


/*global document*/
/*eslint no-undef: "error"*/