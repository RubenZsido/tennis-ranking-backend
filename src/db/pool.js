import pg from "pg";
import { config } from "../config.js";

/** Shared PostgreSQL pool for the API. */
export const pool = new pg.Pool({ connectionString: config.databaseUrl });
