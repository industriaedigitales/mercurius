import os from "os";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";


// --- Percorsi base ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.resolve(__dirname, "uploads");

// Determine path to dist-react (where built assets are)
// In dev: we might not use this fully if we use Vite dev server, but for production/build:
// It should be ../../../dist-react relative to this file (src/web/server.mjs)
// src/web/server.mjs -> src/web -> src -> root -> dist-react
const DIST_DIR = path.resolve(__dirname, "..", "..", "dist-react");

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

// Serve static assets from dist-react
app.use("/assets/*", serveStatic({ root: DIST_DIR }));
app.use("/vite.svg", serveStatic({ root: DIST_DIR }));

// ✅ Route principale: serve mobile.html
app.get("/", async (c) => {
  // In production, serve the built mobile.html
  // In dev, we might want to redirect to Vite dev server if running separately, 
  // but for simplicity let's assume we rely on the build or serve the file if exists.
  // If running via `npm run dev`, the electron main process spawns this server.
  // But the React dev server runs on 5123. 
  // To make development easier for the mobile view, we should probably just serve the built file
  // OR if we want HMR, we'd need to proxy.
  // For now, let's serve the file from dist-react if it exists, otherwise fallback to a simple message
  // telling the user to run `npm run build`.
  
  const mobileHtmlPath = path.join(DIST_DIR, "mobile.html");
  if (fs.existsSync(mobileHtmlPath)) {
    const content = fs.readFileSync(mobileHtmlPath, "utf-8");
    return c.html(content);
  } else {
    return c.html(`
      <h1>Mobile App Not Built</h1>
      <p>Please run <code>npm run build</code> to generate the mobile interface.</p>
    `);
  }
});

// ✅ Gestione upload multiplo (POST /upload)
// ✅ Gestione upload multiplo (POST /upload)
app.post("/upload", async (c) => {
  try {
    const body = await c.req.parseBody({ all: true });
    const uploadedFiles = body["multimediaFile"];
    const isJson = c.req.header("Accept") === "application/json";

    if (!uploadedFiles) {
      const msg = "Nessun file caricato";
      return isJson ? c.json({ error: msg }, 400) : c.text(msg, 400);
    }

    // Ensure it's an array
    const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
    const savedFiles = [];

    for (const file of fileArray) {
      if (file instanceof File) {
        const buffer = await file.arrayBuffer();
        const originalName = file.name;
        // Simple sanitization to prevent directory traversal
        const safeName = path.basename(originalName); 
        const filePath = path.join(UPLOAD_DIR, safeName);
        
        fs.writeFileSync(filePath, Buffer.from(buffer));
        savedFiles.push({ name: safeName, path: filePath });
      }
    }

    if (isJson) {
      return c.json({ success: true, count: savedFiles.length });
    } else {
      // Fallback for non-JS form submission
      const fileList = savedFiles
        .map(
          (f) =>
            `<li>${f.name}<br><small>${f.path}</small></li>`
        )
        .join("");

      return c.html(`
        <h1>Caricamento riuscito!</h1>
        <ul>${fileList}</ul>
        <a href="/">Torna al form</a>
      `);
    }
  } catch (err) {
    console.error("Upload error:", err);
    const isJson = c.req.header("Accept") === "application/json";
    const msg = "Errore durante l'upload: " + err.message;
    return isJson ? c.json({ error: msg }, 500) : c.text(msg, 500);
  }
});

// ✅ Avvio server
const PORT = 3000;
serve({ fetch: app.fetch, port: PORT });

console.log(`🚀 Server Hono in esecuzione su http://localhost:${PORT}`);
console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
console.log(`🌐 IP LAN: ${getLanIp()}:3000`);
