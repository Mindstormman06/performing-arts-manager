import "dotenv/config";

const isTestEnv =
	process.env.NODE_ENV === "test" || typeof process.env.VITEST !== "undefined";

// A fallback secret is only acceptable in automated tests. Anywhere else a
// missing secret would let anyone forge tokens, so refuse to start.
export const JWT_SECRET =
	process.env.JWT_SECRET || (isTestEnv ? "test-only-jwt-secret" : undefined);

/* v8 ignore start */
if (!JWT_SECRET) {
	throw new Error(
		"JWT_SECRET environment variable must be set (refusing to start without it).",
	);
}
/* v8 ignore stop */

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";
