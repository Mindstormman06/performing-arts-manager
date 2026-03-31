import { Link, Route, Routes, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { useAuth } from "./hooks/useAuth.js";
import LoginPage from "./pages/Login.jsx";
import OrgDashboard from "./pages/organizations/OrgDashboard.jsx";
import SignupPage from "./pages/Signup.jsx";
import "./assets/styles.css";
import OrgOverview from "./pages/organizations/OrgOverview.jsx";
import ShowOverview from "./pages/shows/ShowOverview.jsx";
import { useEffect } from "react";
import { verifyToken } from "./services/api.js";
import OrgInventory from "./pages/organizations/OrgInventory.jsx";
import OrgSchedule from "./pages/organizations/OrgSchedule.jsx";
import ShowInventory from "./pages/shows/ShowInventory.jsx";
import ShowSchedule from "./pages/shows/ShowSchedule.jsx";
import ShowCasting from "./pages/shows/ShowCasting.jsx";
import Logo from "./components/ui/Logo.jsx";
import Landing from "./pages/Landing.jsx";

function App() {
	const { token, logout } = useAuth();
	const location = useLocation();

	const shouldCenter =
		location.pathname === "/login" || location.pathname === "/signup";
	const isLanding = location.pathname === "/";

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

						<div className="flex items-center gap-3">
							<Link to={token ? "/" : "/"}>
								<Logo className="h-10 w-auto drop-shadow-md hover:opacity-90 transition-opacity" />
							</Link>
							<h1 className="font-bold text-xl hidden sm:block">
								Performing Arts Manager
							</h1>
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
				className={`flex-1 ${isLanding ? "bg-black" : "bg-gray-100"} ${shouldCenter ? "flex items-center justify-center" : ""}`}
			>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignupPage />} />
					<Route path="/" element={<Landing token={token} />} />
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
						path="/orgs/:orgId/scheduling"
						element={
							<PrivateRoute>
								<OrgSchedule />
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
					<Route
						path="/orgs/:orgId/shows/:showId/scheduling"
						element={
							<PrivateRoute>
								<ShowSchedule />
							</PrivateRoute>
						}
					/>
					<Route
						path="/orgs/:orgId/shows/:showId/casting"
						element={
							<PrivateRoute>
								<ShowCasting />
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