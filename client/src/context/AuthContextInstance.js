/**
 * The React context object that carries the auth session.
 *
 * @remarks
 * Exports `AuthContext`, defaulting to `null`. It lives apart from
 * `AuthProvider` so that file exports only a component, which React Refresh
 * requires. Consumers should use `useAuth` rather than reading it directly.
 */

import { createContext } from "react";
export const AuthContext = createContext(null);
