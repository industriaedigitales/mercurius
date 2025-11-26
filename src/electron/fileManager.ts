import { BrowserWindow } from "electron";
import { readdirSync, statSync, createWriteStream } from "fs";
import { join } from "path";
import { ipcWebContentSend } from "./utils.js";

/**
 * Legge i file presenti in una directory e restituisce un array di nomi di file.
 * @param FILE_PATH percorso assoluto della directory
 * @returns string[] - nomi dei file presenti nella directory
 */
export function listFiles(mainWindow: BrowserWindow): string[] {
  try {
    // Legge tutti gli elementi nella directory
    const FILE_PATH = "/Users/lucapulina/Desktop/Stella";
    const items = readdirSync(FILE_PATH);

    // Filtra solo i file (esclude sottocartelle)
    const files = items.filter((item) => {
      const fullPath = join(FILE_PATH, item);
      return statSync(fullPath).isFile();
    });

    ipcWebContentSend("subscribeFileList", mainWindow.webContents, files);
    console.log(files);
    return files;
  } catch (error) {
    console.error("Errore durante la lettura della directory:", error);
    return [];
  }
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
