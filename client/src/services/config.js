/**
 * Central configuration for the application
 * Loads environment variables and provides them throughout the app
 */

export const BACKEND_URL =
	import.meta.env.VITE_BACKEND_URL || "http://localhost:8050";

export const API_BASE_URL = `${BACKEND_URL}/api`;

export default {
	BACKEND_URL,
	API_BASE_URL,
};
