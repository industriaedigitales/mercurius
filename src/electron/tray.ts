import { app, Tray, Menu, BrowserWindow, nativeImage } from 'electron';
import path from 'path';
import { isDev } from './utils.js';

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow) {
  const iconPath = isDev() 
    ? path.join(process.cwd(), 'desktopIcon.png') 
    : path.join(process.resourcesPath, 'desktopIcon.png');
  
  const icon = nativeImage.createFromPath(iconPath);
  // Optional: on macOS, template images are preferred for menu bar icons
  if (process.platform === 'darwin') {
    icon.setTemplateImage(true);
  }

  tray = new Tray(icon.resize({ width: 16, height: 16 }));
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Mostra Mercurius', 
      click: () => {
        mainWindow.show();
      } 
    },
    { type: 'separator' },
    { 
      label: 'Esci', 
      click: () => {
        app.quit();
      } 
    }
  ]);

  tray.setToolTip('Mercurius - Local File Transfer');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  return tray;
}
