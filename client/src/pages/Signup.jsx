import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageInput from "../components/ui/PageInput.jsx";
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
					<PageInput
						name="fname"
						placeholder="First Name"
						onChange={handleChange}
						required
					/>
					<PageInput
						name="lname"
						placeholder="Last Name"
						onChange={handleChange}
						required
					/>
					<PageInput
						name="email"
						type="email"
						placeholder="Email"
						onChange={handleChange}
						required
					/>
					<PageInput
						name="password"
						type="password"
						placeholder="Password"
						onChange={handleChange}
						required
					/>
					<PageInput
						type="password"
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
					<button
						type="submit"
						className="cursor-pointer w-full rounded-md bg-blue-500 py-2 text-white transition duration-200 hover:bg-blue-600"
					>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
}
