/**
 * HTTP server settings for the API.
 *
 * @remarks
 * Loads `.env` on import and exports `expressConfig`, whose `port` comes from
 * `API_PORT` and defaults to 5000.
 */

import "dotenv/config";

export const expressConfig = {
	port: process.env.API_PORT || 5000,
};
