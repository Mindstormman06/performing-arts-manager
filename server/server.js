/**
 * Express application for the API server.
 *
 * @remarks
 * Exports the configured `app`: CORS, security headers, JSON parsing, static
 * `/uploads` with a strict Content-Security-Policy, the `/api/*` routers, a 404
 * handler, and a JSON error handler that hides 5xx details when `NODE_ENV` is
 * `production`. Outside tests it runs `sequelize.sync()` on import, and unless
 * under Vitest it listens on `API_PORT`. Reads `CORS_ORIGIN`, `TRUST_PROXY`
 * and `DB_SYNC_ALTER`, and adds crash-test routes when running tests.
 */

import cors from "cors";
import express from "express";

import { expressConfig } from "./src/config/index.js";
import adminRouter from "./src/routes/admin.route.js";
import authRouter from "./src/routes/auth.route.js";
import inventoryRouter from "./src/routes/inventory.route.js";
import organizationRouter from "./src/routes/organization.route.js";
import scheduleRouter from "./src/routes/schedule.route.js";
import showRouter from "./src/routes/show.route.js";
import userRouter from "./src/routes/user.route.js";
import sequelize from "./src/services/db.service.js";

const app = express();

const isTestEnv =
	process.env.NODE_ENV === "test" || typeof process.env.VITEST !== "undefined";

// CORS: restrict to CORS_ORIGIN (comma-separated) when set; otherwise allow
// any origin, which is only appropriate for local development.
const corsOrigins = (process.env.CORS_ORIGIN || "")
	.split(",")
	.map((o) => o.trim())
	.filter(Boolean);
app.use(cors(corsOrigins.length > 0 ? { origin: corsOrigins } : undefined));

app.disable("x-powered-by");

// Behind a reverse proxy, set TRUST_PROXY (e.g. "1" for one hop) so req.ip is
// the real client address. Rate limiting keys on it.
if (process.env.TRUST_PROXY) {
	const hops = Number(process.env.TRUST_PROXY);
	app.set("trust proxy", Number.isNaN(hops) ? process.env.TRUST_PROXY : hops);
}
app.use((_req, res, next) => {
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
	next();
});
app.use(express.json());

// Serve uploaded files statically. Uploads are images only, so forbid any
// active content and cross-origin framing even if something slips through.
app.use(
	"/uploads",
	(_req, res, next) => {
		res.setHeader(
			"Content-Security-Policy",
			"default-src 'none'; img-src 'self'; sandbox",
		);
		res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
		next();
	},
	express.static("uploads", { dotfiles: "deny", index: false }),
);

/* v8 ignore start */
if (!isTestEnv) {
	// sync() only creates missing tables. Altering existing tables on every
	// boot can drop or rewrite production data, so it is opt-in.
	const alter = process.env.DB_SYNC_ALTER === "true";
	sequelize
		.sync({ alter })
		.then(() => console.log("Database synchronized!"))
		.catch((err) => console.error("Error syncing database:", err));
}
/* v8 ignore stop */

app.get("/server-up", (_req, res) => {
	res.json({ message: "ok" });
});

if (isTestEnv) {
	app.get("/crash-test", (_req, _res, next) => {
		next(new Error("Intentional crash for testing error handling"));
	});

	app.get("/crash-test-minimal", (_req, _res, next) => {
		next({});
	});

	app.get("/test", (_req, res) => {
		res.json({ message: "This is a test route." });
	});
}

app.use("/api/users", userRouter);
app.use("/api/orgs", organizationRouter);
app.use("/api/shows", showRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/schedule", scheduleRouter);

app.use((_req, _res, next) => {
	next({
		statusCode: 404,
		message: "Route Not Found",
	});
});

app.use((err, _req, res, _next) => {
	const statusCode = err.statusCode || err.status || 500;
	console.error(err);
	if (res.headersSent) return;

	// Don't leak internal error details (SQL, stack messages) to clients
	const exposeMessage =
		statusCode < 500 || process.env.NODE_ENV !== "production";
	res.status(statusCode).json({
		success: false,
		message:
			(exposeMessage && err.message) ||
			(statusCode >= 500 ? "Internal server error" : "Request failed"),
	});
});

/* v8 ignore start */
if (typeof process.env.VITEST === "undefined") {
	app.listen(expressConfig.port, () => {
		console.log(`Server is running on http://localhost:${expressConfig.port}`);
	});
}
/* v8 ignore stop */

export default app;
