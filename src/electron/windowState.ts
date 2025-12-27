import { BrowserWindow, screen } from 'electron';
import { getSettings, saveSettings } from './store.js';

export interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized: boolean;
}

export function getWindowState(): WindowState {
  const settings = getSettings() as any;
  const defaultState: WindowState = {
    width: 1200,
    height: 800,
    isMaximized: false,
  };

  return settings.windowState || defaultState;
}

export function saveWindowState(window: BrowserWindow): void {
  const bounds = window.getBounds();
  const settings = getSettings();
  (settings as any).windowState = {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    isMaximized: window.isMaximized(),
  };
  saveSettings(settings);
}

export function applyWindowState(window: BrowserWindow): void {
  const state = getWindowState();
  
  // Check if saved position is still on screen
  const displays = screen.getAllDisplays();
  const isVisible = displays.some(display => {
    if (state.x === undefined || state.y === undefined) return true;
    return (
      state.x >= display.bounds.x &&
      state.y >= display.bounds.y &&
      state.x + state.width <= display.bounds.x + display.bounds.width &&
      state.y + state.height <= display.bounds.y + display.bounds.height
    );
  });

  if (state.x !== undefined && state.y !== undefined && isVisible) {
    window.setBounds({
      x: state.x,
      y: state.y,
      width: state.width,
      height: state.height,
    });
  } else {
    window.setSize(state.width, state.height);
    window.center();
  }

  if (state.isMaximized) {
    window.maximize();
  }
}
