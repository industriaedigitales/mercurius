import { app, BrowserWindow, Tray, dialog } from "electron";
import path from "path";
import { ipcHandle, isDev } from "./utils.js";
import { getAssetPath, getPreloadPath, getUiPath } from "./pathResolver.js";
import { listFiles, writeToFile, deleteFiles } from "./fileManager.js";
import { spawn, ChildProcess } from "child_process";
import { getUploadDirectory, setUploadDirectory } from "./store.js";

import os from "os";

let webServerProcess: ChildProcess | null = null;

function getLanIp() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const { address, family } of iface) {
      if (
        family === "IPv4" &&
        !address.startsWith("127.") &&
        !address.startsWith("169.254")
      ) {
        return address;
      }
    }
  }
  return "N/A";
}

function startWebServer() {
  if (webServerProcess) {
    console.log("Web server already running.");
    return;
  }

  console.log("Starting web server...");
  try {
    let serverPath: string;
    if (isDev()) {
      serverPath = path.join(process.cwd(), "src", "web", "server.mjs");
    } else {
      serverPath = path.join(process.resourcesPath, "server", "server.mjs");
    }
    
    console.log("Server path:", serverPath);

    const uploadDir = getUploadDirectory();
    console.log("Upload directory:", uploadDir);

    const child = spawn(process.execPath, [serverPath, uploadDir], {
      stdio: ["inherit", "inherit", "inherit", "ipc"],
      env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
    });

    webServerProcess = child;

    child.on("message", (message: any) => {
      if (message && message.type === "device-connected") {
        // Forward to renderer
        const allWindows = BrowserWindow.getAllWindows();
        allWindows.forEach(win => {
          win.webContents.send("deviceConnected", message.payload);
        });
      } else if (message && message.type === "file-uploaded") {
        // Forward to renderer
        const allWindows = BrowserWindow.getAllWindows();
        allWindows.forEach(win => {
          win.webContents.send("fileUploaded", message.payload);
          listFiles(win);
        });
      }
    });

    child.on("error", (err) => {
      console.error("Web server error:", err);
      if (webServerProcess === child) {
        webServerProcess = null;
      }
    });
    
    child.on("exit", (code, signal) => {
      console.log(`Web server exited with code ${code} and signal ${signal}`);
      if (webServerProcess === child) {
        webServerProcess = null;
      }
    });

    app.on("will-quit", () => {
      stopWebServer();
    });
  } catch (err) {
    console.error("Failed to start web server:", err);
  }
}

function stopWebServer() {
  console.log("Stopping web server...");
  if (webServerProcess) {
    webServerProcess.kill();
    webServerProcess = null;
    console.log("Web server stopped.");
  } else {
    console.log("No web server to stop.");
  }
}

app.on("ready", () => {
  startWebServer();
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUiPath());
  }

  mainWindow.webContents.once("did-finish-load", () => {
    setTimeout(() => listFiles(mainWindow), 1000);
  });



  ipcHandle("getServerIp", () => {
    return getLanIp();
  });

  ipcHandle("toggleServer", (enable: boolean) => {
    if (enable) {
      startWebServer();
    } else {
      stopWebServer();
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
    
    // Restart server if running to apply new directory
    if (webServerProcess) {
      stopWebServer();
      startWebServer();
    }

    // Refresh file list for the new directory
    listFiles(mainWindow);

    return newDir;
  });

  /*   new Tray(
    path.join(
      getAssetPath(),
      process.platform === "darwin" ? "tryIcoTemplate.png" : "trayIcon.png"
    )
  ); */
});
