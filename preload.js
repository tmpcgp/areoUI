const { contextBridge, ipcRenderer} = require('electron');

// @Incomplete
contextBridge.exposeInMainWorld('RequestVars', {
  requestvar: (arg) => ipcRenderer.invoke('requestvar', arg)
})
