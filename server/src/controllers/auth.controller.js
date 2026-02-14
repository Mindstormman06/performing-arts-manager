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

export default { login };
