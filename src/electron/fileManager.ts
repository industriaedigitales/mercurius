import { BrowserWindow } from "electron";
import { readdirSync, statSync, createWriteStream, existsSync, unlinkSync } from "fs";
import { join } from "path";
import { ipcWebContentSend } from "./utils.js";

import { getUploadDirectory } from "./store.js";

/**
 * Legge i file presenti in una directory e restituisce un array di nomi di file.
 * @param FILE_PATH percorso assoluto della directory
 * @returns string[] - nomi dei file presenti nella directory
 */
export function listFiles(mainWindow: BrowserWindow): string[] {
  try {
    // Legge tutti gli elementi nella directory
    const FILE_PATH = getUploadDirectory();
    
    if (!existsSync(FILE_PATH)) {
       return [];
    }

    const items = readdirSync(FILE_PATH);

    // Filtra solo i file (esclude sottocartelle)
    const files = items.filter((item) => {
      const fullPath = join(FILE_PATH, item);
      return statSync(fullPath).isFile();
    });

    ipcWebContentSend("subscribeFileList", mainWindow.webContents, files);
    console.log(files);
    return files;
// ... existing listFiles code ...
    return files;
  } catch (error) {
    console.error("Errore durante la lettura della directory:", error);
    return [];
  }
}

export function deleteFiles(mainWindow: BrowserWindow, filenames: string[]): void {
  const FILE_PATH = getUploadDirectory();
  
  if (!existsSync(FILE_PATH)) {
    return;
  }

  filenames.forEach(filename => {
    try {
      const fullPath = join(FILE_PATH, filename);
      if (existsSync(fullPath)) {
        // fs.unlinkSync(fullPath); // Original synchronous
        // Better to use async in real app but sync is fine here for simplicity/consistency with listFiles style
        unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      }
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error);
    }
  });

  // Refresh the file list for the frontend
  listFiles(mainWindow);
}

export function writeToFile(): void {
  const FILE_PATH = "/Users/lucapulina/Desktop/Stella/stella_files.txt";
  const content = "ciao stronzo";
  try {
    const fileStream = createWriteStream(FILE_PATH);
    fileStream.write(content);
    fileStream.end();
  } catch (error) {
    console.error("Errore durante la scrittura del file:", error);
  }
}
