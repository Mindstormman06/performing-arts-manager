import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

/**
 * Route guard that renders its children only for a signed-in user.
 *
 * @remarks
 * Reads the auth token from `useAuth`; with no token it redirects to `/login`
 * via `<Navigate>`, otherwise it renders `children` unchanged. Holds no state
 * and makes no API calls. Must be rendered inside `AuthProvider` and a React
 * Router router.
 */
export default function PrivateRoute({ children }) {
	const { token } = useAuth();
	return token ? children : <Navigate to="/login" />;
}
