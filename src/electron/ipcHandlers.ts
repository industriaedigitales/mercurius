import { BrowserWindow, dialog } from "electron";
import { ipcHandle, getLanIp } from "./utils.js";
import { listFiles, deleteFiles } from "./fileManager.js";
import { getUploadDirectory, setUploadDirectory } from "./store.js";

type ServerFunctions = {
  start: () => void;
  stop: () => void;
  restart: () => void;
};

export function setupIpcHandlers(
  mainWindow: BrowserWindow,
  server: ServerFunctions
) {
  ipcHandle("getServerIp", () => {
    return getLanIp();
  });

  ipcHandle("toggleServer", (enable: boolean) => {
    if (enable) {
      server.start();
    } else {
      server.stop();
    }
  });

  ipcHandle("getUploadDirectory", () => {
    return getUploadDirectory();
  });

  ipcHandle("getFiles", () => {
    return listFiles(mainWindow);
  });

  ipcHandle("deleteFiles", (files: string[]) => {
    deleteFiles(mainWindow, files);
  });

  ipcHandle("selectDirectory", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const newDir = result.filePaths[0];
    setUploadDirectory(newDir);
    
    // Restart server to apply new directory
    server.restart();

    // Refresh file list for the new directory
    listFiles(mainWindow);

    return newDir;
  });
}
