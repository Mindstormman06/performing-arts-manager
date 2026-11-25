/**
 * The client for the backend REST API.
 *
 * @remarks
 * Exports one thin function per endpoint (auth, organizations, shows,
 * casting, inventory, schedules, membership), each returning the axios
 * promise, plus `AUTH_LOGOUT_EVENT`. All calls go through a shared axios
 * instance based at `API_BASE_URL` from `config.js`. Its request interceptor
 * reads `localStorage` key `token` and sends it as a Bearer header. Its
 * response interceptor, on any 401 except from `/auth/login`, removes the
 * stored token and dispatches `AUTH_LOGOUT_EVENT` on `window` so
 * `AuthProvider` can sign out; the error is still rejected to the caller.
 */

import axios from "axios";
import { API_BASE_URL } from "./config.js";

export const AUTH_LOGOUT_EVENT = "auth:logout";

const API = axios.create({
	baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

API.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// A 401 from login means bad credentials, not an expired session.
			if (!error.config?.url?.includes("/auth/login")) {
				localStorage.removeItem("token");
				window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
			}
		}
		return Promise.reject(error);
	},
);

export const login = (credentials) => API.post("/auth/login", credentials);
export const signup = (userData) => API.post("/users", userData);
export const verifyToken = () => API.get("/auth/verify");

export const getOrganizations = () => API.get("/orgs");
export const getOrganization = (id) => API.get(`/orgs/${id}`);
export const createOrganization = (orgData) => API.post("/orgs", orgData);
export const updateOrganization = (id, orgData) =>
	API.put(`/orgs/${id}`, orgData);
export const deleteOrganization = (id) => API.delete(`/orgs/${id}`);
export const getOrganizationUsers = (orgId) => API.get(`/orgs/${orgId}/users`);
export const inviteByEmail = (orgId, email) =>
	API.post(`/orgs/${orgId}/invite`, { email });
export const updateOrganizationUserRoles = (orgId, userId, roles) =>
	API.put(`/orgs/${orgId}/users/${userId}/roles`, { roles });
export const removeUserFromOrganization = (orgId, userId) =>
	API.delete(`/orgs/${orgId}/users/${userId}`);
export const respondToInvite = (orgId, action) =>
	API.put(`/orgs/${orgId}/respond`, { action });
export const getMyOrganizations = () => API.get("/orgs/my");

export const getShows = () => API.get("/shows");
export const getUserShows = (orgId) => API.get(`/shows/user?orgId=${orgId}`);
export const getOrgShows = (orgId) => API.get(`/shows?org=${orgId}`);
export const getShow = (id) => API.get(`/shows/${id}`);
export const createShow = (showData) => API.post("/shows", showData);
export const updateShow = (id, showData) => API.put(`/shows/${id}`, showData);
export const deleteShow = (id) => API.delete(`/shows/${id}`);
export const joinShow = (showId) => API.post(`/shows/${showId}/join`);
export const updateShowUserRoles = (showId, userId, roles) =>
	API.put(`/shows/${showId}/users/${userId}/roles`, { roles });
export const getShowUsers = (showId) => API.get(`/shows/${showId}/users`);
export const searchShowUsers = (showId, role) =>
	API.get(`/shows/${showId}/users/search?role=${role}`);
export const getShowUser = (showId, userId) =>
	API.get(`/shows/${showId}/users/${userId}`);
export const removeUserFromShow = (showId, userId) =>
	API.delete(`/shows/${showId}/users/${userId}`);
export const removeShowUserRole = (showId, userId, roles) =>
	API.delete(`/shows/${showId}/users/${userId}/roles`, { data: { roles } });
export const getShowDashboard = (id) => API.get(`/shows/${id}/dashboard`);
export const getAvailableShowRoles = () => API.get("/shows/roles/available");

export const getShowCasting = (showId) => API.get(`/shows/${showId}/casting`);
export const getShowCharacter = (showId, characterId) =>
	API.get(`/shows/${showId}/casting/${characterId}`);
export const createShowCharacter = (showId, data) =>
	API.post(`/shows/${showId}/casting`, data);
export const updateShowCharacter = (showId, characterId, data) =>
	API.put(`/shows/${showId}/casting/${characterId}`, data);
export const assignShowCharacter = (showId, characterId, users_id) =>
	API.put(`/shows/${showId}/casting/${characterId}/assign`, { users_id });
export const deleteShowCharacter = (showId, characterId) =>
	API.delete(`/shows/${showId}/casting/${characterId}`);

export const getDepartments = () => API.get("/inventory/departments");

export const getGlobalInventory = (orgId) =>
	API.get(`/inventory/orgs/${orgId}`);
export const createGlobalInventoryItem = (orgId, data) =>
	API.post(`/inventory/orgs/${orgId}`, data);
export const updateGlobalInventoryItem = (orgId, itemId, data) =>
	API.put(`/inventory/orgs/${orgId}/items/${itemId}`, data);
export const deleteGlobalInventoryItem = (orgId, itemId) =>
	API.delete(`/inventory/orgs/${orgId}/items/${itemId}`);

export const getShowInventory = (showId) =>
	API.get(`/inventory/shows/${showId}`);
export const createShowItem = (showId, data) =>
	API.post(`/inventory/shows/${showId}`, data);
export const updateShowInventoryItem = (showId, itemId, data) =>
	API.put(`/inventory/shows/${showId}/items/${itemId}`, data);
export const assignShowInventoryItem = (showId, itemId, data) =>
	API.put(`/inventory/shows/${showId}/items/${itemId}/assign`, data);
export const createShowItemWithPhoto = (showId, formData) =>
	API.post(`/inventory/shows/${showId}`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
export const pullGlobalItemToShow = (showId, itemId) =>
	API.post(`/inventory/shows/${showId}/pull/${itemId}`);
export const removeShowItem = (showId, itemId) =>
	API.delete(`/inventory/shows/${showId}/items/${itemId}`);

export const createGlobalInventoryItemWithPhoto = (orgId, formData) =>
	API.post(`/inventory/orgs/${orgId}`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

export const getOrgCalendar = (orgId) => API.get(`/schedule/orgs/${orgId}`);
export const getShowCalendar = (showId) => API.get(`/schedule/shows/${showId}`);
export const getPersonalCalendar = () => API.get("/schedule/personal");

export const createShowEvent = (showId, eventData) =>
	API.post(`/schedule/shows/${showId}`, eventData);
export const updateShowEvent = (showId, eventId, eventData) =>
	API.put(`/schedule/shows/${showId}/${eventId}`, eventData);
export const deleteShowEvent = (showId, eventId) =>
	API.delete(`/schedule/shows/${showId}/${eventId}`);
export const assignShowEventUsers = (showId, eventId, assignData) =>
	API.put(`/schedule/shows/${showId}/${eventId}/users`, assignData);

export const createOrgEvent = (orgId, eventData) =>
	API.post(`/schedule/orgs/${orgId}`, eventData);
export const updateOrgEvent = (orgId, eventId, eventData) =>
	API.put(`/schedule/orgs/${orgId}/${eventId}`, eventData);
export const deleteOrgEvent = (orgId, eventId) =>
	API.delete(`/schedule/orgs/${orgId}/${eventId}`);
export const assignOrgEventUsers = (orgId, eventId, assignData) =>
	API.put(`/schedule/orgs/${orgId}/${eventId}/users`, assignData);

export const addUserToShow = (showId, userId) =>
	API.post(`/shows/${showId}/join`, { userId });
export const inviteUserToShow = (showId, data) =>
	API.post(`/shows/${showId}/invite`, data);
