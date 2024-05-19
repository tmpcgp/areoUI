const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('RequestVars', {
  requestvar: (arg) => ipcRenderer.invoke('requestvar', arg).then(result => result)
})
