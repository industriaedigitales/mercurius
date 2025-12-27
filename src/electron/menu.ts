import { app, Menu, MenuItemConstructorOptions, shell, BrowserWindow } from 'electron';
import { t } from './i18n.js';

export function setupMenu(mainWindow: BrowserWindow, server: any) {
  const isMac = process.platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { label: t('menu.about') as string, role: 'about' as const },
              { type: 'separator' as const },
              { 
                label: t('menu.preferences') as string, 
                accelerator: 'CmdOrCtrl+,',
                click: () => {
                   mainWindow.show();
                   mainWindow.webContents.send('navigate', '/settings');
                }
              },
              { type: 'separator' as const },
              { role: 'services' as const },
              { type: 'separator' as const },
              { role: 'hide' as const },
              { role: 'hideOthers' as const },
              { role: 'unhide' as const },
              { type: 'separator' as const },
              { label: t('menu.quit') as string, role: 'quit' as const },
            ],
          },
        ]
      : []),
    {
      label: t('menu.file') as string,
      submenu: [
        {
          label: t('menu.gallery') as string,
          accelerator: 'CmdOrCtrl+G',
          click: () => {
            mainWindow.show();
            mainWindow.webContents.send('navigate', '/gallery');
          }
        },
        { type: 'separator' as const },
        isMac ? { role: 'close' as const } : { label: t('menu.quit') as string, role: 'quit' as const }
      ],
    },
    {
      label: t('menu.edit') as string,
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        { role: 'delete' as const },
        { type: 'separator' as const },
        { role: 'selectAll' as const },
      ],
    },
    {
      label: t('menu.server') as string,
      submenu: [
        {
          label: t('menu.toggleServer') as string,
          click: () => {
            mainWindow.webContents.send('menu-action', 'toggle-server');
          }
        },
        {
          label: t('menu.togglePublic') as string,
          click: () => {
            mainWindow.webContents.send('menu-action', 'toggle-public');
          }
        }
      ]
    },
    {
      label: t('menu.view') as string,
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
      ],
    },
    {
      label: t('menu.window') as string,
      submenu: [
        { role: 'minimize' as const },
        { role: 'zoom' as const },
        ...(isMac
          ? [
              { type: 'separator' as const },
              { role: 'front' as const },
              { type: 'separator' as const },
              { role: 'window' as const },
            ]
          : [{ role: 'close' as const }]),
      ],
    },
    {
      role: 'help' as const,
      label: t('menu.help') as string,
      submenu: [
        {
          label: t('menu.documentation') as string,
          click: async () => {
            await shell.openExternal('https://github.com/industriaedigitales/mercurius');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
