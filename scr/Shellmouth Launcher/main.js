// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const { ipcMain } = require('electron')
const path = require('path')
const {shell} = require('electron');
const fs = require('fs');
var cmd=require('node-cmd');

// Minecraft Launcher
const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();

// Load config
let configPath = __dirname + '\\test.json';
console.log(configPath)
let config = undefined;

if (fs.existsSync(configPath)) {
    let rawConfig = fs.readFileSync(path.resolve(configPath));
    config = JSON.parse(rawConfig);
    console.log(config);
    gameOptions = undefined;
    console.log("Found config!")
} else {
  console.log("Config not found, creating...");
  config = {"theme":"light","login":["",""]};
}

console.log(config)

gameOptions = {
  clientPackage: null,
  // For production launchers, I recommend not passing 
  // the getAuth function through the authorization field and instead
  // handling authentication outside before you initialize
  // MCLC so you can handle auth based errors and validation!
  authorization: undefined,
  root: "./minecraft",
  version: {
      number: "1.17.1",
      type: "release",
      custom: "fabric"
  },
  memory: {
      max: "6G",
      min: "4G"
  },
}

// TRY TO LOGIN
try {
  gameOptions.authorization = Authenticator.getAuth(config.login[0], config.login[1]);
} catch (error) {
  console.log("LOGIN ERROR")
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 815,
    height: 638,
    frame: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('pages/home/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

//Uses node.js process manager
const electron = require('electron');
const child_process = require('child_process');
const dialog = electron.dialog;



function launchGame() {
  
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('checkForUpdate', (event) => {
  console.log("Checking for update")
  event.returnValue = true
})

ipcMain.on('test', (event) => {
  console.log("IPC Test Command Recived!")
  event.returnValue = true
})

ipcMain.on('openBrowser', (event, url) => {
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
});

ipcMain.on('game', (event, args) => {
  console.log("Start Game Command Recive")
  if (args == "start") {
    // check if the game is installed
    const path = './installed'

    if (fs.existsSync(path)) {
      console.log("Attempting to start Minecraft...")
      // Check if JDK16 has been installed via the CashCraft Installer
      if (fs.existsSync(__dirname + "\\java\\jdkinstalled")) {
        console.log("Using internal java JDK16 install.")
        gameOptions.javaPath = __dirname + "\\java\\jdk16\\jdk-16.0.1\\bin\\javaw.exe"
      }
      else {
        console.log("Using external java install.")
      }
      launcher.launch(gameOptions);
      launcher.on('debug', (e) => console.log(e));
      launcher.on('data', (e) => console.log(e));
      launcher.on('close', (code) => event.reply("gameEnded", code));
    }
    else {
      console.log("trying to install!")
      // If the game is not installed, install it.
      cmd.runSync(__dirname + "\\python\\python.exe " + __dirname + "\\installServerPack.py")
      event.reply("gameEnded", 0)
    }
  }
})

ipcMain.on('getConfig', (event) => {
  event.reply('config', config);
})

ipcMain.on('setConfig', (event, newConfig) => {
  config = newConfig;
  newJson = JSON.stringify(config);
  fs.writeFileSync('test.json', newJson, 'utf-8');
  gameOptions.authorization = Authenticator.getAuth(config.login[0], config.login[1]);
  console.log("Wrote config.json")
})

ipcMain.on('openExplorer', (event, path) => {
  shell.showItemInFolder(path);
})

ipcMain.on('installJDK', (event) => {
  cmd.runSync(__dirname + "\\python\\python.exe " + __dirname + "\\installJDK.py");
})

ipcMain.on('authenticate', (event, credentials) => {
  console.log("logging in with credentials " + credentials)
  let authData = Authenticator.getAuth(credentials[0], credentials[1]);
  event.reply('authData', authData)
})