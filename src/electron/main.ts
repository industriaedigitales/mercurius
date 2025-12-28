import { app, BrowserWindow, session } from "electron";
import path from "path";
import { isDev, getLanIp } from "./utils.js";
import log from 'electron-log/main.js';

log.initialize();
log.info('Mercurius starting...');

process.on('uncaughtException', (err) => {
  log.error('Main process uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  log.error('Main process unhandled rejection:', reason);
});
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
    log.info("Web server already running.");
    return;
  }

  log.info("Starting web server...");
  try {
    let serverPath: string;
    if (isDev()) {
      serverPath = path.join(process.cwd(), "src", "web", "server.mjs");
    } else {
      serverPath = path.join(process.resourcesPath, "server", "server.mjs");
    }
    
    log.info("Server path:", serverPath);

    const uploadDir = getUploadDirectory();
    log.info("Upload directory:", uploadDir);

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
      log.error("Web server error:", err);
      if (webServerProcess === child) {
        webServerProcess = null;
      }
    });
    
    child.on("exit", (code, signal) => {
      log.info(`Web server exited with code ${code} and signal ${signal}`);
      if (webServerProcess === child) {
        webServerProcess = null;
      }
    });
  } catch (err) {
    log.error("Failed to start web server:", err);
  }
}

function stopWebServer() {
  log.info("Stopping web server...");
  if (webServerProcess) {
    webServerProcess.kill();
    webServerProcess = null;
    log.info("Web server stopped.");
  } else {
    log.info("No web server to stop.");
  }
  stopTunnel();
}

async function startTunnel() {
  if (tunnel) return tunnelUrl;
  
  try {
    log.info("Starting localtunnel...");
    tunnel = await localtunnel({ port: 3000 });
    tunnelUrl = tunnel.url;
    log.info("Tunnel started at:", tunnelUrl);
    
    tunnel.on("close", () => {
      log.info("Tunnel closed");
      tunnel = null;
      tunnelUrl = null;
    });

    return tunnelUrl;
  } catch (err) {
    log.error("Failed to start tunnel:", err);
    throw err;
  }
}

function stopTunnel() {
  if (tunnel) {
    log.info("Stopping tunnel...");
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
  try {
    await initI18n();
  } catch (err) {
    log.error("Failed to initialize i18n:", err);
  }
  startWebServer();
  
  const isMac = process.platform === 'darwin';
  const isWin = process.platform === 'win32';

  mainWindow = new BrowserWindow({
    show: false, // Start hidden as requested
    titleBarStyle: isMac ? 'hiddenInset' : (isWin ? 'hidden' : 'default'),
    ...(isWin ? {
      titleBarOverlay: {
        color: '#0a0a0a',
        symbolColor: '#ffffff',
        height: 40
      }
    } : {}),
    trafficLightPosition: isMac ? { x: 20, y: 20 } : undefined,
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

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const csp = isDev()
      ? "default-src 'self' http://localhost:* ws://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; img-src 'self' data: blob: http:; video-src 'self' data: blob: http:; connect-src 'self' http://localhost:* ws://localhost:* http://*:*;"
      : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; img-src 'self' data: http:; video-src 'self' data: blob: http:; connect-src 'self' http://localhost:* ws://localhost:* http://*:*;";

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp]
      }
    });
  });

  session.defaultSession.on('will-download', () => {}); // Just a stub if needed
  
  let lastIp = getLanIp();
  setInterval(() => {
    const currentIp = getLanIp();
    if (currentIp !== lastIp) {
      log.info('IP change detected by polling:', lastIp, '->', currentIp);
      lastIp = currentIp;
      if (mainWindow) {
        mainWindow.webContents.send('ipChanged', lastIp);
      }
    }
  }, 10000);

  mainWindow.once('ready-to-show', () => {
    // We don't call show() here because user requested "start hidden"
    log.info("App is ready. Running in tray.");
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
