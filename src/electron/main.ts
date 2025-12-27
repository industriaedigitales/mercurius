import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { getPreloadPath, getUiPath } from "./pathResolver.js";
import { listFiles } from "./fileManager.js";
import { spawn, ChildProcess } from "child_process";
import { getUploadDirectory } from "./store.js";
import { setupIpcHandlers } from "./ipcHandlers.js";
import { createTray } from "./tray.js";
import { setupMenu } from "./menu.js";
import { applyWindowState, saveWindowState } from "./windowState.js";
// @ts-ignore
import localtunnel from "localtunnel";

import { initI18n } from "./i18n.js";

let webServerProcess: ChildProcess | null = null;
let tunnel: any = null;
let tunnelUrl: string | null = null;
let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

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
  stopTunnel();
}

async function startTunnel() {
  if (tunnel) return tunnelUrl;
  
  try {
    console.log("Starting localtunnel...");
    tunnel = await localtunnel({ port: 3000 });
    tunnelUrl = tunnel.url;
    console.log("Tunnel started at:", tunnelUrl);
    
    tunnel.on("close", () => {
      console.log("Tunnel closed");
      tunnel = null;
      tunnelUrl = null;
    });

    return tunnelUrl;
  } catch (err) {
    console.error("Failed to start tunnel:", err);
    throw err;
  }
}

function stopTunnel() {
  if (tunnel) {
    console.log("Stopping tunnel...");
    tunnel.close();
    tunnel = null;
    tunnelUrl = null;
  }
}

function getTunnelUrl() {
  return tunnelUrl;
}

function restartWebServer() {
  if (webServerProcess) {
    stopWebServer();
  }
  startWebServer();
}

app.on("ready", async () => {
  await initI18n();
  startWebServer();
  
  mainWindow = new BrowserWindow({
    show: false, // Start hidden as requested
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  setupMenu(mainWindow, {
    start: startWebServer,
    stop: stopWebServer,
    restart: restartWebServer,
    startTunnel,
    stopTunnel,
    getTunnelUrl
  });

  applyWindowState(mainWindow);
  createTray(mainWindow);

  mainWindow.once('ready-to-show', () => {
    // We don't call show() here because user requested "start hidden"
    console.log("App is ready. Running in tray.");
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('moved', () => saveWindowState(mainWindow!));
  mainWindow.on('resized', () => saveWindowState(mainWindow!));

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUiPath());
  }

  mainWindow.webContents.once("did-finish-load", () => {
    setTimeout(() => {
      if (mainWindow) listFiles(mainWindow);
    }, 1000);
  });

  setupIpcHandlers(mainWindow, {
    start: startWebServer,
    stop: stopWebServer,
    restart: restartWebServer,
    startTunnel,
    stopTunnel,
    getTunnelUrl
  });
});

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("will-quit", () => {
  stopWebServer();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // Re-create window if it was closed (only on macOS usually)
    // But we are hiding it, so this might not be needed unless we change logic.
  } else {
    mainWindow?.show();
  }
});
