import { Link, Route, Routes, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { useAuth } from "./hooks/useAuth.js";
import LoginPage from "./pages/Login.jsx";
import OrgDashboard from "./pages/OrgDashboard.jsx";
import SignupPage from "./pages/Signup.jsx";
import "./assets/styles.css";
import OrgOverview from "./pages/OrgOverview.jsx";
import ShowOverview from "./pages/ShowOverview.jsx"; // <-- 1. Imported the new component
import { useEffect } from "react";
import { verifyToken } from "./services/api.js";
import OrgInventory from "./pages/OrgInventory.jsx";
import ShowInventory from "./components/ShowInventory.jsx";

function App() {
	const { token, logout } = useAuth();
	const location = useLocation();

	// Check if current route should be centered (login/signup)
	const shouldCenter =
		location.pathname === "/login" || location.pathname === "/signup";

	useEffect(() => {
		const validateSession = async () => {
			if (token) {
				try {
					await verifyToken();
				} catch (error) {
					// ONLY log out if the token is explicitly rejected (401)
					if (error.response && error.response.status === 401) {
						console.warn("Session invalid or user no longer exists. Logging out.");
						logout();
					}
				}
			}
		};

		validateSession();
	}, [token, logout]);

	return (
		<div className="flex min-h-screen flex-col">
			{/* Navbar */}
			<nav className="bg-blue-600 text-white shadow-lg">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 justify-between">
						<div className="flex items-center">
							<h1 className="font-bold text-xl">Performing Arts Manager</h1>
						</div>
						<div className="flex items-center space-x-4">
							{!token ? (
								<>
									<Link
										to="/login"
										className="cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700"
									>
										Login
									</Link>
									<Link
										to="/signup"
										className="cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700"
									>
										Sign Up
									</Link>
								</>
							) : (
								<>
									<Link
										to="/organizations"
										className="cursor-pointer rounded-md px-3 py-2 hover:bg-blue-700"
									>
										Dashboard
									</Link>
									<button
										onClick={logout}
										type="button"
										className="cursor-pointer rounded-md bg-red-500 px-3 py-2 font-medium text-sm transition hover:bg-red-600"
									>
										Logout
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main
				className={`flex-1 bg-gray-100 ${shouldCenter ? "flex items-center justify-center" : ""}`}
			>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route
						path="/"
						element={<h2>Welcome to Performing Arts Manager</h2>}
					/>
					<Route
						path="/organizations"
						element={
							<PrivateRoute>
								<OrgDashboard />
							</PrivateRoute>
						}
					/>
					<Route
						path="/orgs/:orgId/overview"
						element={
							<PrivateRoute>
								<OrgOverview />
							</PrivateRoute>
						}
					/>
					{/* 2. Added the new route right here */}
					<Route
						path="/orgs/:orgId/shows/:showId"
						element={
							<PrivateRoute>
								<ShowOverview />
							</PrivateRoute>
						}
					/>
					<Route
						path="/orgs/:orgId/inventory"
						element={
							<PrivateRoute>
								<OrgInventory />
							</PrivateRoute>
						}
					/>
					<Route
						path="/orgs/:orgId/shows/:showId/inventory"
						element={
							<PrivateRoute>
								<ShowInventory />
							</PrivateRoute>
						}
					/>
				</Routes>
			</main>

			{/* Footer */}
			<footer className="bg-gray-800 text-white">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="mt-4 mb-4 border-gray-700 text-center">
						<p className="text-gray-300 text-sm">
							© 2026 Performing Arts Manager. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default App;