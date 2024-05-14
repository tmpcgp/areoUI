const electron = require("electron");
const app      = electron.app;

const BrowserWindow  = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const url            = "http://localhost:3000";

let mainWindow;
let splash;

const W = 810;
const H = 610;

const go_previous_page_command = "CommandOrControl+p";
const disable                  = [go_previous_page_command];

// to disable, nav bar is doing the job.
// override the go back stuff.
app.on ( 'ready', () => {


  disable.map((d) => {
    globalShortcut.register(d, () => {
      // mainwindow.webcontents.goback();
      console.log ("Do Nothing When " + d);
    });
  });

  mainWindow = new BrowserWindow(
    {
      width : W,
      height : H,
      show : false,
    }
  );

  mainWindow.loadURL(url);
  mainWindow.show();
});

app.on ( 'window-all-closed', function () {
  if ( process.platform !== 'darwin' ) {
    app.quit();
  }
});

app.on( 'activate', function () {
  if ( mainWindow === null ) {
    createWindow();
  }
});
