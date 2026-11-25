/**
 * The Vite build and dev-server configuration for the client.
 *
 * @remarks
 * Enables the React and Tailwind plugins. The dev server listens on all
 * interfaces on port 5173, fails instead of picking another port, and accepts
 * any Host header, so it is reachable from containers and other machines.
 * Playwright expects it on that port.
 */

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: "0.0.0.0",
		port: 5173,
		strictPort: true,
		allowedHosts: true,
	},
});
