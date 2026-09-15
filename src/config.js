import dotenv from "dotenv";

dotenv.config();

/** App settings loaded from environment. */
export const config = {
  port: Number(process.env.PORT) || 3000,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
