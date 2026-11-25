/**
 * The hook for reading the auth session.
 *
 * @remarks
 * Exports `useAuth`, which returns `{ user, token, setToken, logout }` from
 * `AuthContext` and throws if called outside `AuthProvider`.
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContextInstance";

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
