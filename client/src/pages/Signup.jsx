import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api";

export default function SignupPage() {
	const [formData, setFormData] = useState({
		fname: "",
		lname: "",
		email: "",
		password: "",
	});
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (formData.password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		try {
			// Sends fname, lname, email, and password
			await signup(formData);
			navigate("/login");
		} catch (err) {
			setError(err.response?.data?.message || "Signup failed");
		}
	};

	return (
		<div className="w-full max-w-md">
			<div className="rounded-lg bg-white p-8 shadow-md">
				<h2 className="mb-6 text-center font-bold text-2xl">Create Account</h2>
				{error && <p className="mb-4 text-center text-red-500">{error}</p>}
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						name="fname"
						placeholder="First Name"
						onChange={handleChange}
						className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					<input
						name="lname"
						placeholder="Last Name"
						onChange={handleChange}
						className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					<input
						name="email"
						type="email"
						placeholder="Email"
						onChange={handleChange}
						className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					<input
						name="password"
						type="password"
						placeholder="Password"
						onChange={handleChange}
						className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
					<button
						type="submit"
						className="w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
					>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
}
