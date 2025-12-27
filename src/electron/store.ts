import { app } from 'electron';
import path from 'path';
import fs from 'fs';

interface Settings {
  uploadDirectory: string;
  language: string;
  onboarded: boolean;
}

const userDataPath = app.getPath('userData');
const settingsPath = path.join(userDataPath, 'settings.json');

const defaultSettings: Settings = {
  uploadDirectory: path.join(app.getPath('home'), 'Downloads', 'MercuriusUploads'),
  language: 'en',
  onboarded: false,
};

export function getSettings(): Settings {
  try {
    if (!fs.existsSync(settingsPath)) {
      saveSettings(defaultSettings);
      return defaultSettings;
    }
    const data = fs.readFileSync(settingsPath, 'utf-8');
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch (error) {
    console.error('Error reading settings:', error);
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings): void {
  try {
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
