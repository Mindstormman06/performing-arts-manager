import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_LOGOUT_EVENT, verifyToken } from "../services/api.js";
import { AuthContext } from "./AuthContextInstance";

/**
 * The provider that holds the signed-in session for the whole app.
 *
 * @remarks
 * Provides `{ user, token, setToken, logout }` through `AuthContext`; read it
 * with `useAuth`. The token is initialised from `localStorage` key `token`;
 * whoever signs in must write it there as well as calling `setToken`. Whenever
 * the token changes it calls `/auth/verify` to load `user`, keeping the
 * session on non-401 errors. `logout` removes the stored token, clears state
 * and navigates to `/login`. A 401 from any request makes the axios
 * interceptor in `api.js` clear the token and fire `AUTH_LOGOUT_EVENT` on
 * `window`, which this provider answers by calling `logout`. Must render
 * inside a router because it uses `useNavigate`.
 */
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

	useEffect(() => {
		if (!token) return;
		let cancelled = false;
		verifyToken()
			.then(({ data }) => {
				if (!cancelled) setUser(data.user ?? null);
			})
			.catch(() => {
				// A 401 is already handled by the api.js interceptor.
			});
		return () => {
			cancelled = true;
		};
	}, [token]);

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
