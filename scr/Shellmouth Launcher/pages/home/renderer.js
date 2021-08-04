// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron');
const {shell} = require('electron');
const mcping = require('mc-ping-updated');

const fs = require("fs");

gameRunning = false;

function showSnackBar(snackBarID) {
    // Get the snackbar DIV
    var snackBar = document.getElementById(snackBarID);
  
    // Add the "snackbar-show" class to DIV
    snackBar.classList.add("snackbar-show");
  
    // After 21.5 seconds, remove the show class from DIV
    setTimeout(function(){ snackBar.className = snackBar.className.replace("snackbar-show", ""); }, 21500);
}

function openMenu(menuID) {
    var menu = document.getElementById(menuID);
    menu.classList.remove("hidden");
}

function closeMenu(menuID) {
    var menu = document.getElementById(menuID);
    menu.classList.add("hidden");
}

function openLoginWindow() {
    closeMenu("jdkInstaller")
    var menu = document.getElementById("loginWindow");
    menu.classList.remove("hidden");
}

function openSettings() {
    var menu = document.getElementById("settingsWindow");
    menu.classList.remove("hidden");
}

function openVersion() {
    var menu = document.getElementById("versionWindow");
    menu.classList.remove("hidden");
}

function saveLogin() {
    var menu = document.getElementById("loginWindow");
    menu.classList.add("hidden");
    let credentials = ["",""]
    credentials[0] = document.getElementById("emailBox").value;
    credentials[1] = document.getElementById("psswdBox").value;
    ipcRenderer.send("authenticate", credentials);
}

function saveSettings() {
    var menu = document.getElementById("settingsWindow");
    menu.classList.add("hidden");
    console.log("Saved Settings")
}

function saveVersion() {
    var menu = document.getElementById("versionWindow");
    menu.classList.add("hidden");
    console.log("Saved Version");
}

function showNetworkDisconnectScreen() {
    closeMenu("loginWindow");
    saveSettings();
    saveVersion();
    var menu = document.getElementById("networkDisconnectWindow");
    menu.classList.remove("hidden");
    document.getElementById("optionDropdownBtn").disabled = true;
    document.getElementById("settingsBtn").disabled = true;
}

function setThemeLight() {
    document.documentElement.style.setProperty('--bg', 'rgb(236, 236, 236)');
    document.documentElement.style.setProperty('--bg-header', 'rgb(190, 190, 190)');
    document.documentElement.style.setProperty('--header-icon', 'black');
    document.documentElement.style.setProperty('--theme-text', 'black');
    // document.getElementById("titleText").style.color = "black";
    if (!videoEnabled) {
        document.getElementById("largeCenterText").style.color = "black";
    }
    config.theme = "light"
    ipcRenderer.send("setConfig", config)
}

function setThemeDark() {
    document.documentElement.style.setProperty('--bg', 'rgb(7, 7, 61)');
    document.documentElement.style.setProperty('--bg-header', 'rgb(0, 0, 29)');
    document.documentElement.style.setProperty('--header-icon', 'white');
    document.documentElement.style.setProperty('--theme-text', 'white');
    // document.getElementById("titleText").style.color = "white";
    document.getElementById("largeCenterText").style.color = "white";
    config.theme = "dark"
    ipcRenderer.send("setConfig", config)
}

function setVersion(version) {
    const element = document.getElementById("versionText");
    element.innerHTML = "Version: " + version;
    saveVersion();
}

function toggleTheme(currentTheme) {
    
    if (currentTheme == "dark") {
        setThemeLight();
        newTheme = "light"
    }

    else {
        setThemeDark();
        newTheme = "dark"
    }
    return newTheme
}

function toggleVideo(currentVideoState) {
    video = document.getElementById("bgVideo")
    if (currentVideoState == true) {
        newState = false;
        video.style.display = "none";
        if (theme == "light") {
            document.getElementById("largeCenterText").style.color = "black";
        }
    }

    else {
        newState = true;
        document.getElementById("largeCenterText").style.color = "white";
        video.style.display = "block";
    }
    return newState
}

function openUrl(url) {
    ipcRenderer.send("openBrowser", url)
}

// CHECK FOR UPDATES
// This delays launcher start up time so keep it off for now
// console.log("checking for updates...");
// updateAvalible = ipcRenderer.sendSync('checkForUpdates');
// if (updateAvalible) {
//     console.log("update avalible");
//     showUpdateSnackBar();
// }

function ipcTest() {
    console.log("Testing IPC...");
    ipcOK = ipcRenderer.sendSync('test');
    if (ipcOK) {
        console.log("IPC OK!");
    }
    else {
        console.log("IPC FAIL!");
    }
}

function launchGame() {
    ipcRenderer.send("game", "start");
    launchBtn = document.getElementById("launchBtn");
    oldTxt = document.getElementById("launchBtnIdle");
    newTxt = document.getElementById("launchBtnLaunching");
    document.getElementById("launchBtnInstall").style.display = "none";
    loadingAnimation = document.getElementById("dotBricksAnimation");
    loadingAnimation.classList.add("dot-bricks-show");
    oldTxt.style.display = "none";
    newTxt.style.display = "block";
    launchBtn.disabled = true;
}

function installJDK () {
    ipcRenderer.send("installJDK")
}

ipcRenderer.on('gameEnded', (event, stopCode) => {
    gameRunning = "false";
    console.log("Game ended | Stop Code: " + stopCode)
    launchBtn = document.getElementById("launchBtn");
    newTxt = document.getElementById("launchBtnIdle");
    oldTxt = document.getElementById("launchBtnLaunching");
    loadingAnimation = document.getElementById("dotBricksAnimation");
    loadingAnimation.classList.remove("dot-bricks-show");
    oldTxt.style.display = "none";
    newTxt.style.display = "block";
    launchBtn.disabled = false;

    if (stopCode != 0) {
        crashSnackbar = document.getElementById("crashSnackbar");
        crashSnackbar.textContent = "Game Crashed! Code " + stopCode;
        showSnackBar("crashSnackbar");
    }
})

ipcRenderer.on('gameInfo', (event, infoType, infoData) => {
    loadingAnimation = document.getElementById("dotBricksAnimation");
    launchBtnLaunching = document.getElementById("launchBtnLaunching");
    launchBtnCustom = document.getElementById("launchBtnOther");
    launchBtnCustomTxt = document.getElementById("launchBtnOtherTxt");

    if (infoType == "progress") {
        loadingAnimation.classList.remove("dot-bricks-show");
        launchBtnLaunching.style.display = "none";
        launchBtnCustom.style.display = "block";
        launchBtnCustomTxt.textContent = "Downloading..."
    }
})

config = undefined;
console.log(ipcRenderer.send("getConfig"))
ipcRenderer.on('config', (event, newConfig) => {
    config = newConfig
    console.log(config)
    if (config.theme == "light") {
        theme = setThemeLight("theme");
    }
})

ipcRenderer.on('authData', (event, auth) => {
    console.log(auth)
})

// Check if cashcraft is installed
const path = './installed'

try {
  if (fs.existsSync(path)) {
    document.getElementById("launchBtnInstall").style.display = "none";
    document.getElementById("launchBtnIdle").style.display = "block";
  }
} catch(err) {
  console.log("Game not installed!")
}

ipcRenderer.send("getConfig");

shell.showItemInFolder("C:/");
