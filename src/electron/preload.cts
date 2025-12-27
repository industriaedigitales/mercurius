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
  startTunnel: () => ipcInvoke("startTunnel"),
  stopTunnel: () => ipcInvoke("stopTunnel"),
  getTunnelUrl: () => ipcInvoke("getTunnelUrl"),
  getPublicIp: () => ipcInvoke("getPublicIp"),
  getLanguage: () => ipcInvoke("getLanguage"),
  setLanguage: (lang) => ipcInvoke("setLanguage", lang),
  getOnboarded: () => ipcInvoke("getOnboarded"),
  setOnboarded: (onboarded) => ipcInvoke("setOnboarded", onboarded),
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
  subscribeNavigate: (callback) => {
    return ipcOn("navigate", (path) => {
      callback(path);
    });
  },
  subscribeMenuAction: (callback) => {
    return ipcOn("menu-action", (action) => {
      callback(action);
    });
  },
  subscribeIpChanged: (callback) => {
    return ipcOn("ipChanged", (ip) => {
      callback(ip);
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
