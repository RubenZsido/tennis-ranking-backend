import app from "./app.js";
import { config } from "./config.js";
import { initDb } from "./db/init.js";

async function start() {
  try {
    await initDb();
  } catch (err) {
    console.error("Database init failed:", err.message);
    console.error("Check DATABASE_URL and that PostgreSQL is running.");
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`);
  });
}

start();
