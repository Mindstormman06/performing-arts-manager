/**
 * Entry point for app configuration.
 *
 * @remarks
 * Loads `.env` first and only then imports the database and Express config, so
 * their environment variables are set before they are read. Re-exports
 * `databaseConfig` and `expressConfig`.
 */

import dotenv from "dotenv";

dotenv.config();

const { databaseConfig } = await import("./database.config.js");
const { expressConfig } = await import("./express.config.js");

export { databaseConfig, expressConfig };
