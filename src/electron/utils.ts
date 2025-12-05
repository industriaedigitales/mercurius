import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUiPath } from "./pathResolver.js";
import { pathToFileURL } from "url";
import os from "os";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getLanIp() {
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

export function ipcHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (...args: any[]) => Promise<EventPayloadMapping[Key]> | EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event, ...args) => {
    validateEventFrame(event.senderFrame);
    return handler(...args);
  });
}

export function ipcWebContentSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain | null) {
  if (!frame) {
    throw new Error("Malicious event");
  }
  if (isDev() && new URL(frame.url).host === "localhost:5123") {
    return;
  }
  
  const frameUrl = new URL(frame.url);
  const uiUrl = pathToFileURL(getUiPath());

  if (
    frameUrl.protocol !== uiUrl.protocol ||
    frameUrl.pathname !== uiUrl.pathname
  ) {
    throw new Error("Malicious event");
  }
}
