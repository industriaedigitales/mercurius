import { app, BrowserWindow, Tray } from "electron";
import path from "path";
import { ipcHandle, isDev } from "./utils.js";
import { getAssetPath, getPreloadPath, getUiPath } from "./pathResolver.js";
import { listFiles, writeToFile } from "./fileManager.js";
import { spawn, ChildProcess } from "child_process";

let webServerProcess: ChildProcess | null = null;

function startWebServer() {
  try {
    if (isDev()) {
      const serverPath = path.join(process.cwd(), "src", "web", "server.mjs");
      webServerProcess = spawn(process.execPath, [serverPath], {
        stdio: "inherit",
      });
    } else {
      // in produzione copia server.mjs in extraResources (vedi package.json build.extraResources)
      const serverPath = path.join(
        process.resourcesPath,
        "server",
        "server.mjs"
      );
      webServerProcess = spawn(process.execPath, [serverPath], {
        stdio: "inherit",
      });
    }

    webServerProcess.on("error", (err) => {
      console.error("Web server error:", err);
    });

    app.on("will-quit", () => {
      if (webServerProcess && !webServerProcess.killed) {
        webServerProcess.kill();
      }
    });
  } catch (err) {
    console.error("Failed to start web server:", err);
  }
}

app.on("ready", () => {
  startWebServer();
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUiPath());
  }

  mainWindow.webContents.once("did-finish-load", () => {
    setTimeout(() => listFiles(mainWindow), 1000);
  });

  ipcHandle("writeMyString", () => {
    return writeToFile();
  });

  /*   new Tray(
    path.join(
      getAssetPath(),
      process.platform === "darwin" ? "tryIcoTemplate.png" : "trayIcon.png"
    )
  ); */
});
