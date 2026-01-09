import dotenv from "dotenv";
dotenv.config();

const { databaseConfig } = await import('./database.config.js');
const { expressConfig } = await import('./express.config.js');

export { expressConfig, databaseConfig }