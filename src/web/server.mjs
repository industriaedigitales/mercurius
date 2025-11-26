import os from "os";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import formidable from "formidable";

// --- Percorsi base ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, "uploads");

// --- Assicurati che la directory di upload esista ---
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// --- Ottieni l’IP LAN ---
function getLanIp() {
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

// --- Inizializza Hono ---
const app = new Hono();

// ✅ Route principale: serve HTML
app.get("/", (c) => {
  const lanIp = getLanIp();
  return c.html(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <title>Upload Multimediale</title>
    </head>
    <body>
      <h1>Carica File Multimediale</h1>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="multimediaFile" accept="image/*,video/*,audio/*" multiple required>
        <button type="submit">Carica File</button>
      </form>
      <p>I file verranno salvati in: <b>${UPLOAD_DIR}</b></p>
      <p>IP della macchina: <b>${lanIp}</b></p>
    </body>
    </html>
  `);
});

// ✅ Gestione upload multiplo (POST /upload)
app.post("/upload", async (c) => {
  return new Promise((resolve) => {
    const form = formidable({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      multiples: true,
    });

    form.parse(c.req.raw, (err, fields, files) => {
      if (err) {
        resolve(c.text("Errore durante l'upload: " + err.message, 500));
        return;
      }

      const uploadedFiles = files.multimediaFile;
      if (!uploadedFiles || uploadedFiles.length === 0) {
        resolve(c.text("Nessun file caricato", 400));
        return;
      }

      const fileList = uploadedFiles
        .map(
          (file) =>
            `<li>${path.basename(file.filepath)}<br><small>${
              file.filepath
            }</small></li>`
        )
        .join("");

      resolve(
        c.html(`
          <h1>Caricamento riuscito!</h1>
          <ul>${fileList}</ul>
          <a href="/">Torna al form</a>
        `)
      );
    });
  });
});

// ✅ Avvio server
const PORT = 3000;
serve({ fetch: app.fetch, port: PORT });

console.log(`🚀 Server Hono in esecuzione su http://localhost:${PORT}`);
console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
console.log(`🌐 IP LAN: ${getLanIp()}:3000`);
