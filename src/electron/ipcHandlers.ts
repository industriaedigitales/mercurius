import { BrowserWindow, dialog } from "electron";
import path from "path";
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

  ipcHandle("printFile", (file: string) => {
    const printWindow = new BrowserWindow({ show: false });
    // Use local file path for robustness
    const fullPath = path.join(getUploadDirectory(), file);
    const fileUrl = `file://${fullPath}`;
    
    printWindow.loadURL(fileUrl);

    printWindow.webContents.on("did-finish-load", () => {
      printWindow.webContents.print({}, (success, failureReason) => {
        if (!success) console.log("Print failed:", failureReason);
        printWindow.close();
      });
    });
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
