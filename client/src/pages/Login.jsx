import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { login } from "../services/api.js";
import PageInput from "../components/ui/PageInput.jsx";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { setToken } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const { data } = await login({ email, password });
			localStorage.setItem("token", data.token);
			setToken(data.token); // Update the auth context
			navigate("/organizations");
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
		}
	};

	return (
		<div className="w-full max-w-md">
			<div className="rounded-lg bg-white p-8 shadow-md">
				<h2 className="mb-6 text-center font-bold text-2xl">Login</h2>
				{error && <p className="mb-4 text-center text-red-500">{error}</p>}
				<form onSubmit={handleSubmit} className="space-y-4">
					<PageInput
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<PageInput
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button
						type="submit"
						className="cursor-pointer w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
}
