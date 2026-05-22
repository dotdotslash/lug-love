import express from "express";
import { getPayload } from "payload";
import config from "./payload.config.js";
import path from "path";
import { fileURLToPath } from "url";

const PORT = parseInt(process.env.PAYLOAD_PORT ?? "3001", 10);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = path.resolve(__dirname, "../media");

const app = express();

// Serve uploaded media files directly
app.use("/media", express.static(MEDIA_DIR));

const start = async () => {
  const payload = await getPayload({ config });

  // Mount Payload's built-in Express router (admin UI + REST API)
  app.use(payload.router);

  app.listen(PORT, () => {
    payload.logger.info(`Admin:  http://localhost:${PORT}/admin`);
    payload.logger.info(`API:    http://localhost:${PORT}/api`);
    payload.logger.info(`Media:  http://localhost:${PORT}/media`);
  });
};

start();
