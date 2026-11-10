import { app } from "electron";
import path from "path";

export function getPreloadPath() {
  return path.join(app.getAppPath(), "dist-electron", "preload.cjs");
}

export function getUiPath() {
  return path.join(app.getAppPath(), "dist-react", "index.html");
}

export function getAssetPath() {
  return path.join(app.getAppPath(), "src", "assets");
}
