import { app } from 'electron';
import path from 'path';
import fs from 'fs';

interface Settings {
  uploadDirectory: string;
  language: string;
  onboarded: boolean;
}

function getSettingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json');
}

function getDefaultSettings(): Settings {
  return {
    uploadDirectory: path.join(app.getPath('home'), 'Downloads', 'MercuriusUploads'),
    language: 'en',
    onboarded: false,
  };
}

export function getSettings(): Settings {
  try {
    const settingsPath = getSettingsPath();
    const defaultSettings = getDefaultSettings();
    if (!fs.existsSync(settingsPath)) {
      saveSettings(defaultSettings);
      return defaultSettings;
    }
    const data = fs.readFileSync(settingsPath, 'utf-8');
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch (error) {
    console.error('Error reading settings:', error);
    return getDefaultSettings();
  }
}

export function saveSettings(settings: Settings): void {
  try {
    const settingsPath = getSettingsPath();
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export function getUploadDirectory(): string {
  return getSettings().uploadDirectory;
}

export function setUploadDirectory(dir: string): void {
  const settings = getSettings();
  settings.uploadDirectory = dir;
  saveSettings(settings);
}

export function getLanguage(): string {
  return getSettings().language;
}

export function setLanguage(lang: string): void {
  const settings = getSettings();
  settings.language = lang;
  saveSettings(settings);
}

export function getOnboarded(): boolean {
  return getSettings().onboarded;
}

export function setOnboarded(onboarded: boolean): void {
  const settings = getSettings();
  settings.onboarded = onboarded;
  saveSettings(settings);
}
