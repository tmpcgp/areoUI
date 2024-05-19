var {app, ipcMain, BrowserWindow, globalShortcut, session} = require("electron");
const nodeFs                                               = require('fs');
const nodeOS                                               = require("os");
const nodePath                                             = require('path');

const url = "http://localhost:3000";
const W   = 810;
const H   = 610;

let mainWindow;
let vars;

const go_previous_page_command = "CommandOrControl+p";
const disable                  = [go_previous_page_command];

// for devs ONLY.
// on macOS
/*
const reactDevToolsPath = path.join(
  os.homedir(),
)
*/

console.log(nodeOS.homedir());

// reading config file
// const configRootPath = nodePath.join(electronApp.getPath('userData'), 'dbConfig.json');
try {
  const configRootPath = nodePath.join(app.getPath('userData'), '.areorc');
  vars                 = JSON.parse(nodeFs.readFileSync(configRootPath, 'utf-8'));
} catch (e) {
  console.log("@something went wrong with err "+e);
}

const compute_vars = async (event, varName) => {
  let value = vars[varName];
  console.log("react :: querying -> " + value);
  return value;
};

app.on ( 'ready', async () => {
  disable.map((d) => {
    globalShortcut.register(d, () => {
      // mainwindow.webcontents.goback();
      console.log ("Do Nothing When " + d);
    });
  });

  ipcMain.handle("requestvar", async (event, arg) => {
    return await compute_vars(event, arg);
  });

  mainWindow = new BrowserWindow({
      width : W,
      height : H,
      show : false,
      webPreferences: {
        preload: nodePath.join(__dirname, 'preload.js')
      }
    }
  );

  // laoding url after then showing, for more responsive stuff ?
  mainWindow.loadURL(url);
  mainWindow.show();
});

app.on ( 'window-all-closed', function () {
  if ( process.platform !== 'darwin' ) {
    app.quit();
  }
});
