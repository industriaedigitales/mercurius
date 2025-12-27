import { BrowserWindow, dialog } from "electron";
import path from "path";
import { ipcHandle, getLanIp } from "./utils.js";
import { listFiles, deleteFiles } from "./fileManager.js";
import { getUploadDirectory, setUploadDirectory } from "./store.js";

type ServerFunctions = {
  start: () => void;
  stop: () => void;
  restart: () => void;
  startTunnel: () => Promise<string | null>;
  stopTunnel: () => void;
  getTunnelUrl: () => string | null;
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

  ipcHandle("startTunnel", async () => {
    return await server.startTunnel();
  });

  ipcHandle("stopTunnel", () => {
    server.stopTunnel();
  });

  ipcHandle("getTunnelUrl", () => {
    return server.getTunnelUrl();
  });

  ipcHandle("getPublicIp", async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch public IP:", error);
      return null;
    }
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

  ipcHandle("getLanguage", async () => {
    const { getLanguage } = await import("./store.js");
    return getLanguage();
  });

  ipcHandle("setLanguage", async (lang: string) => {
    const { setLanguage: storeSetLanguage } = await import("./store.js");
    const { changeLanguage, t } = await import("./i18n.js");
    const { setupMenu } = await import("./menu.js");

    storeSetLanguage(lang);
    await changeLanguage(lang);
    setupMenu(mainWindow, server);

    return true;
  });

  ipcHandle("getOnboarded", async () => {
    const { getOnboarded } = await import("./store.js");
    return getOnboarded();
  });

  ipcHandle("setOnboarded", async (onboarded: boolean) => {
    const { setOnboarded } = await import("./store.js");
    setOnboarded(onboarded);
  });
}
