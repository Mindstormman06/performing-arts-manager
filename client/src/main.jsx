/**
 * The browser entry point that mounts the React app.
 *
 * @remarks
 * Renders `App` into `#root` from `index.html`, wrapped in `BrowserRouter`
 * and then `AuthProvider` (which needs the router), and imports the global
 * Tailwind stylesheet.
 */

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./assets/styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<AuthProvider>
			<App />
		</AuthProvider>
	</BrowserRouter>,
);
