const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeFileList: (callback) => {
    return ipcOn("subscribeFileList", (fileList) => {
      callback(fileList);
    });
  },
  getServerIp: () => ipcInvoke("getServerIp"),
  toggleServer: (enable) => ipcInvoke("toggleServer", enable),
  selectDirectory: () => ipcInvoke("selectDirectory"),
  getUploadDirectory: () => ipcInvoke("getUploadDirectory"),
  getFiles: () => ipcInvoke("getFiles"),
  deleteFiles: (files) => ipcInvoke("deleteFiles", files),
  printFile: (file) => ipcInvoke("printFile", file),
  subscribeDeviceConnected: (callback) => {
    return ipcOn("deviceConnected", (deviceInfo) => {
      callback(deviceInfo);
    });
  },
  subscribeFileUploaded: (callback) => {
    return ipcOn("fileUploaded", (uploadInfo) => {
      callback(uploadInfo);
    });
  },
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload?: any
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key, payload);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload);
}
