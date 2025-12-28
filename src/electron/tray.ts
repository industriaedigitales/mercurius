import { app, Tray, Menu, BrowserWindow, nativeImage } from 'electron';
import path from 'path';
import { isDev } from './utils.js';

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow) {
  const iconPath = path.join(app.getAppPath(), 'src/assets', 'trayIcon.png');
  
  const icon = nativeImage.createFromPath(iconPath);
  
  // Su macOS, le immagini template si adattano automaticamente se la barra è chiara o scura
  if (process.platform === 'darwin') {
    icon.setTemplateImage(true);
  }

  // Ridimensionamento standard per tray icon
  const trayIcon = icon.resize({ width: 18, height: 18 });
  tray = new Tray(trayIcon);
  
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
