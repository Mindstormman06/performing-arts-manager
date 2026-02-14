import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateOrgModal from "../components/CreateOrgModal";
import EditOrgModal from "../components/EditOrgModal";
import {
	deleteOrganization,
	getMyOrganizations,
	getOrganizations,
	respondToInvite,
} from "../services/api"; //

export default function OrgDashboard() {
	const [organizations, setOrganizations] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOrg, setSelectedOrg] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const fetchOrganizations = useCallback(async () => {
		try {
			setLoading(true);
			console.log("Starting to fetch organizations...");

			// Check if we have a token
			const token = localStorage.getItem("token");
			console.log("Auth token present:", !!token);

			// TEMP: Also fetch all organizations to see if any exist
			try {
				const allOrgsResponse = await getOrganizations();
				console.log("All organizations in DB:", allOrgsResponse.data);
			} catch (allOrgsErr) {
				console.log("Could not fetch all organizations:", allOrgsErr.message);
			}

			// Fetch user's memberships with roles
			const membershipsResponse = await getMyOrganizations();
			const memberships = membershipsResponse.data || [];

			console.log("API Response status:", membershipsResponse.status);
			console.log("Memberships data:", memberships);
			console.log("Number of memberships:", memberships.length);

			setOrganizations(memberships);
		} catch (err) {
			console.error("Failed to fetch organizations:", err);
			console.error("Error response:", err.response?.data);
			console.error("Error status:", err.response?.status);
			// Fallback to empty array
			setOrganizations([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleDelete = async (orgId) => {
		if (
			window.confirm(
				"Are you sure you want to delete this organization? This action cannot be undone.",
			)
		) {
			try {
				await deleteOrganization(orgId); //
				fetchOrganizations();
			} catch (err) {
				alert(err.response?.data?.message || "Failed to delete organization");
			}
		}
	};

	const handleInviteAction = async (orgId, action) => {
		try {
			// action is 'accept' or 'decline'
			await respondToInvite(orgId, action);
			fetchOrganizations();
		} catch (err) {
			alert(err.response?.data?.message || "Action failed");
		}
	};

	const hasAdminPermissions = (orgId) => {
		const membership = organizations.find((org) => org.org_id === orgId);
		if (!membership || !membership.assignedRoles) return false;

		const roleNames = membership.assignedRoles.map((role) => role.name);
		return roleNames.includes("admin") || roleNames.includes("president");
	};

	useEffect(() => {
		console.log("OrgDashboard component mounted, fetching organizations...");
		fetchOrganizations();
	}, [fetchOrganizations]);

	// Split organizations by status
	const activeOrgs = organizations.filter((o) => o.status === "active");
	const pendingInvites = organizations.filter((o) => o.status === "pending");

	return (
		<div className="py-8">
			<CreateOrgModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={fetchOrganizations}
			/>
			<EditOrgModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onSuccess={fetchOrganizations}
				org={selectedOrg}
			/>

			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				{/* 1. Pending Invitations Section */}
				{pendingInvites.length > 0 && (
					<section className="mb-12">
						<h2 className="mb-4 font-bold text-2xl text-orange-600">
							Pending Invitations
						</h2>
						<div className="space-y-4">
							{pendingInvites.map((invite) => (
								<div
									key={invite.org_id}
									className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-6 shadow-sm"
								>
									<div>
										<h3 className="font-semibold text-gray-900 text-lg">
											{invite.Organization?.name || "Organization Invite"}
										</h3>
										<p className="text-gray-600 text-sm">
											You've been invited to join.
										</p>
									</div>
									<div className="flex space-x-3">
										<button
											type="button"
											onClick={() =>
												handleInviteAction(invite.org_id, "accept")
											}
											className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
										>
											Accept
										</button>
										<button
											type="button"
											onClick={() =>
												handleInviteAction(invite.org_id, "decline")
											}
											className="cursor-pointer rounded border border-red-600 bg-white px-4 py-2 text-red-600 hover:bg-red-50"
										>
											Decline
										</button>
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{/* 2. Active Organizations Section */}
				<header className="mb-8 flex items-center justify-between">
					<h2 className="font-bold text-3xl text-gray-900">
						Your Organizations
					</h2>
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="cursor-pointer rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
					>
						+ New Organization
					</button>
				</header>

				<div className="space-y-4">
					{loading ? (
						<div className="rounded-lg bg-white p-8 text-center shadow-md">
							<p className="text-gray-600 text-lg">
								Loading your organizations...
							</p>
						</div>
					) : activeOrgs.length > 0 ? (
						activeOrgs.map((org) => {
							const orgData = org.Organization || org;
							return (
								<div
									key={orgData.id}
									className="rounded-lg bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg"
								>
									<div className="flex items-center justify-between">
										<h3 className="font-semibold text-gray-800 text-xl">
											{orgData.name}
										</h3>
										<div className="flex items-center space-x-3">
											<button
												type="button"
												onClick={() => navigate(`/orgs/${orgData.id}/shows`)}
												className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
												title="View Shows"
											>
												View Shows
											</button>
											{/* Admin-only actions */}
											{hasAdminPermissions(org.org_id) && (
												<>
													<button
														type="button"
														onClick={() =>
															navigate(`/orgs/${orgData.id}/users`)
														}
														className="cursor-pointer rounded-md bg-gray-700 px-3 py-2 text-white hover:bg-gray-800"
														title="Manage Users"
													>
														👥
													</button>
													<button
														type="button"
														onClick={() => {
															setSelectedOrg(orgData);
															setIsEditModalOpen(true);
														}}
														className="cursor-pointer rounded-md bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
														title="Edit Organization"
													>
														✏️
													</button>
													<button
														type="button"
														onClick={() => handleDelete(orgData.id)}
														className="cursor-pointer rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600"
														title="Delete Organization"
													>
														🗑️
													</button>
												</>
											)}
										</div>
									</div>
								</div>
							);
						})
					) : (
						!loading && (
							<div className="rounded-lg bg-white p-8 text-center shadow-md">
								<p className="text-gray-600 text-lg">
									You aren't a member of any organizations yet.
								</p>
								<p className="mt-2 text-gray-500 text-sm">
									Create your first organization to get started!
								</p>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
}
