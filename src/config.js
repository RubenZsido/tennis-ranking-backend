import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is required. Copy .env.example to .env and set your local PostgreSQL connection string.",
  );
  process.exit(1);
}

/** App settings loaded from environment. */
export const config = {
  port: Number(process.env.PORT) || 3000,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL,
};
