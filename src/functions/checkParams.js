const execArgs = process.argv;
const { autoUpdater } = require("electron-updater")
module.exports = {
    devMode: !autoUpdater.app.isPackaged || execArgs.includes('--develop') || execArgs.includes('-d'),
    website: execArgs.includes('--website') || execArgs.includes('-w')
}