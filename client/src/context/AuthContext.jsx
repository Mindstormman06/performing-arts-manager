import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_LOGOUT_EVENT, verifyToken } from "../services/api.js";
import { AuthContext } from "./AuthContextInstance";

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(() => localStorage.getItem("token"));
	const [user, setUser] = useState(null);

	const navigate = useNavigate();

	const logout = useCallback(() => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
		navigate("/login");
	}, [navigate]);

	// Validate the session (and load the user) only when the token changes.
	// A 401 here is handled by the API interceptor, which fires AUTH_LOGOUT_EVENT.
	useEffect(() => {
		if (!token) return;
		let cancelled = false;
		verifyToken()
			.then(({ data }) => {
				if (!cancelled) setUser(data.user ?? null);
			})
			.catch(() => {
				// Non-401 failures (e.g. network) keep the session; 401 is handled globally.
			});
		return () => {
			cancelled = true;
		};
	}, [token]);

	// Single 401 handling path: the axios interceptor clears the stored token and
	// dispatches this event; we reset React state and navigate to /login.
	useEffect(() => {
		window.addEventListener(AUTH_LOGOUT_EVENT, logout);
		return () => window.removeEventListener(AUTH_LOGOUT_EVENT, logout);
	}, [logout]);

	const value = useMemo(
		() => ({ user, token, setToken, logout }),
		[user, token, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
