import axios from "axios";

const API = axios.create({
	baseURL: "http://localhost:8050/api",
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
			// Safely check if the URL contains the login path
			if (!error.config?.url?.includes("/auth/login")) {
				console.warn("Unauthorized! Clearing session and redirecting...");
				localStorage.removeItem("token");
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

// Authentication
export const login = (credentials) => API.post("/auth/login", credentials);
export const signup = (userData) => API.post("/users", userData);
export const verifyToken = () => API.get("/auth/verify");

// Organizations
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

// Shows
export const getShows = () => API.get("/shows");
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
	API.delete(`/shows/${showId}/users/${userId}/roles`, { roles });
export const getShowDashboard = (id) => API.get(`/shows/${id}/dashboard`);

// --- Inventory ---
export const getDepartments = () => API.get("/inventory/departments");

// Global Org Inventory
export const getGlobalInventory = (orgId) => API.get(`/inventory/orgs/${orgId}`);
export const createGlobalInventoryItem = (orgId, data) => API.post(`/inventory/orgs/${orgId}`, data);
export const deleteGlobalInventoryItem = (orgId, itemId) => API.delete(`/inventory/orgs/${orgId}/items/${itemId}`);

// Show Inventory
export const getShowInventory = (showId) => API.get(`/inventory/shows/${showId}`);
export const createShowItem = (showId, data) => API.post(`/inventory/shows/${showId}`, data);
export const pullGlobalItemToShow = (showId, itemId) => API.post(`/inventory/shows/${showId}/pull/${itemId}`);
export const removeShowItem = (showId, itemId) => API.delete(`/inventory/shows/${showId}/items/${itemId}`);

// -- Schedules --

// Fetching
export const getOrgCalendar = (orgId) => API.get(`/schedule/orgs/${orgId}`);
export const getShowCalendar = (showId) => API.get(`/schedule/shows/${showId}`);
export const getPersonalCalendar = () => API.get("/schedule/personal");

// Managing (Show Level)
export const createShowEvent = (showId, eventData) => API.post(`/schedule/shows/${showId}`, eventData);
export const updateShowEvent = (showId, eventId, eventData) => API.put(`/schedule/shows/${showId}/${eventId}`, eventData);1
export const deleteShowEvent = (showId, eventId) => API.delete(`/schedule/shows/${showId}/${eventId}`);
export const assignShowEventUsers = (showId, eventId, assignData) => API.put(`/schedule/shows/${showId}/${eventId}/users`, assignData);

// Managing (Org Level)
export const createOrgEvent = (orgId, eventData) => API.post(`/schedule/orgs/${orgId}`, eventData);
export const updateOrgEvent = (orgId, eventId, eventData) => API.put(`/schedule/orgs/${orgId}/${eventId}`, eventData);
export const deleteOrgEvent = (orgId, eventId) => API.delete(`/schedule/orgs/${orgId}/${eventId}`);
export const assignOrgEventUsers = (orgId, eventId, assignData) => API.put(`/schedule/orgs/${orgId}/${eventId}/users`, assignData);