/**
 * Small in-memory, fixed-window rate limiter.
 *
 * Good enough for a single API instance. If the API is ever scaled to more
 * than one process, move this to a shared store (e.g. Redis) so the limits
 * apply across instances.
 */

const isTestEnv =
	process.env.NODE_ENV === "test" || typeof process.env.VITEST !== "undefined";

export function rateLimit({
	windowMs,
	max,
	key = (req) => req.ip,
	countOnlyFailures = false,
	message = "Too many requests. Please try again later.",
	enabled = !isTestEnv && process.env.RATE_LIMIT_DISABLED !== "true",
}) {
	const hits = new Map();

	// Drop expired windows so the map can't grow without bound
	const sweep = setInterval(() => {
		const now = Date.now();
		for (const [k, entry] of hits) {
			if (entry.resetAt <= now) hits.delete(k);
		}
	}, windowMs);
	sweep.unref?.();

	const limiter = (req, res, next) => {
		if (!enabled) return next();

		const now = Date.now();
		const id = key(req);
		let entry = hits.get(id);
		if (!entry || entry.resetAt <= now) {
			entry = { count: 0, resetAt: now + windowMs };
			hits.set(id, entry);
		}

		if (entry.count >= max) {
			res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
			return res.status(429).json({ success: false, message });
		}

		// Count up front so parallel requests can't slip past the limit, then
		// give the slot back for successful requests when only failures count.
		entry.count += 1;
		if (countOnlyFailures) {
			res.on("finish", () => {
				if (res.statusCode < 400 && entry.count > 0) entry.count -= 1;
			});
		}
		next();
	};

	limiter.reset = () => hits.clear();
	return limiter;
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

const normalizedEmail = (req) =>
	String(req.body?.email || "")
		.trim()
		.toLowerCase();

// Failed logins: per account (from any IP) and per IP (across accounts)
export const loginAccountLimiter = rateLimit({
	windowMs: FIFTEEN_MINUTES,
	max: 10,
	key: (req) => `acct:${normalizedEmail(req)}`,
	countOnlyFailures: true,
	message: "Too many failed login attempts. Please try again later.",
});

export const loginIpLimiter = rateLimit({
	windowMs: FIFTEEN_MINUTES,
	max: 50,
	key: (req) => `ip:${req.ip}`,
	countOnlyFailures: true,
	message: "Too many failed login attempts. Please try again later.",
});

export const signupLimiter = rateLimit({
	windowMs: ONE_HOUR,
	max: 20,
	message: "Too many accounts created from this address. Try again later.",
});
