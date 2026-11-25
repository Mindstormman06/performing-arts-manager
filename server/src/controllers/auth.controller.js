/**
 * Express controller for logging in and verifying a session token.
 *
 * @remarks
 * Delegates to `auth.service`: `login` returns a JWT plus basic user fields,
 * and `verify` returns the profile of `req.user`, which the `authenticate`
 * middleware must have set. Any service error, including a deleted user,
 * responds 401 with the error message.
 */

import authService from "../services/auth.service.js";

async function login(req, res) {
	try {
		const { email, password } = req.body;
		const result = await authService.login(email, password);

		res.json({
			success: true,
			token: result.token,
			user: result.user,
		});
	} catch (error) {
		res.status(401).json({ success: false, message: error.message });
	}
}

async function verify(req, res) {
	try {
		const user = await authService.verify(req.user.id);

		res.json({
			success: true,
			user: user,
		});
	} catch (error) {
		res.status(401).json({ success: false, message: error.message });
	}
}

export default { login, verify };
