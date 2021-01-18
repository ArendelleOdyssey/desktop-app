const { autoUpdater } = require("electron-updater")
const wait = require('util').promisify(setTimeout);
const ping = require('ping')
const EventEmitter = require('events');
const execArgs = process.argv;
function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}
module.exports = function(contents, resolved, createMainWindow){
    try{
        if (!autoUpdater.app.isPackaged || execArgs.includes('--develop') || execArgs.includes('-d')) {
            resolved = true
            createMainWindow();
        } else {
            var textChanged = false
            const myEmitter = new EventEmitter();
            const connexionChecker = ()=>{
                ping.sys.probe('arendelleodyssey.com', function(isAlive){
                if (!isAlive){
                    contents.executeJavaScript("document.getElementById('displaytxt').innerText = 'No connexion, retrying'")
                    textChanged=true
                } else {
                    if (textChanged) contents.executeJavaScript(`document.getElementById('displaytxt').innerText = '${randomItem(require('./content/loadWindow/loadingTexts.json'))}'`)
                    myEmitter.emit('online')
                }
                });
            }
            var connexionCheck = setInterval(connexionChecker, 1000)
        
            myEmitter.on('online', () =>{
                clearInterval(connexionCheck)
                autoUpdater.checkForUpdatesAndNotify();
    
                autoUpdater.on('checking-for-update', () => {
                    contents.executeJavaScript("document.getElementById('facttxt').innerText = 'Checking for updates...'")
                })
                autoUpdater.on('update-available', (info) => {
                    //contents.executeJavaScript("document.getElementById('facttxt').innerText = 'Update available.'")
                    console.log(info)
                })
                autoUpdater.on('update-not-available', (info) => {
                    //contents.executeJavaScript("document.getElementById('facttxt').innerText = 'Update not available.'")
                    console.log(info)
                    
                    resolved = true
                    createMainWindow();
                })
                autoUpdater.on('error', (err) => {
                    contents.executeJavaScript("document.getElementById('facttxt').innerText = 'Error in auto-updater.'")
                    console.error(err);
                    wait(5000).then(()=>{
                        resolved = true
                        createMainWindow();
                    })
                })
                autoUpdater.on('download-progress', (progressObj) => {
                    contents.executeJavaScript(`document.getElementById('facttxt').innerText = \`${progressObj.percent}% - ${progressObj.transferred}/${progressObj.total} (${progressObj.bytesPerSecond})\``)
                })
                autoUpdater.on('update-downloaded', (info) => {
                    contents.executeJavaScript("document.getElementById('facttxt').innerText = 'Update downloaded'")
                    console.log(info)
                    wait(5000).then(()=>{
                        autoUpdater.quitAndInstall();
                    })
                })
            })
        }
    } catch (err) {
        contents.executeJavaScript("document.getElementById('facttxt').innerText = 'Error in auto-updater.'")
        console.error(err)
        wait(5000).then(()=>{
        resolved = true
        createMainWindow();
        })
    }
}