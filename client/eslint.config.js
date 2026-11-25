/**
 * The ESLint flat config for the client.
 *
 * @remarks
 * Applies the recommended JS, React Hooks and React Refresh (Vite) rules to
 * all `.js` and `.jsx` files with browser globals, ignores `dist`, and allows
 * unused variables whose names start with a capital letter or underscore.
 */

import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{js,jsx}"],
		extends: [
			js.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: "latest",
				ecmaFeatures: { jsx: true },
				sourceType: "module",
			},
		},
		rules: {
			"no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
		},
	},
]);
