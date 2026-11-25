/**
 * The client's backend URL configuration.
 *
 * @remarks
 * Exports `BACKEND_URL`, read from the Vite env var `VITE_BACKEND_URL` at
 * build time and defaulting to `http://localhost:8050`, and `API_BASE_URL`,
 * which is that URL plus `/api`. Both are also on the default export.
 */

export const BACKEND_URL =
	import.meta.env.VITE_BACKEND_URL || "http://localhost:8050";

export const API_BASE_URL = `${BACKEND_URL}/api`;

export default {
	BACKEND_URL,
	API_BASE_URL,
};
