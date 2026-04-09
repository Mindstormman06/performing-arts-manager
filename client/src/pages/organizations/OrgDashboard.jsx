import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateOrgModal from "../../components/modals/Organizations/CreateOrgModal.jsx";
import {
	getMyOrganizations,
	respondToInvite,
} from "../../services/api.js";

export default function OrgDashboard() {
	const [organizations, setOrganizations] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	const fetchOrganizations = useCallback(async () => {
		try {
			setLoading(true);

			const membershipsResponse = await getMyOrganizations();
			const memberships = membershipsResponse.data || [];

			setOrganizations(memberships);
		} catch (err) {
			console.error("Failed to fetch organizations:", err);
			setOrganizations([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleInviteAction = async (orgId, action) => {
		try {
			await respondToInvite(orgId, action);
			fetchOrganizations();
		} catch (err) {
			alert(err.response?.data?.message || "Action failed");
		}
	};

	useEffect(() => {
		fetchOrganizations();
	}, [fetchOrganizations]);

	const activeOrgs = organizations.filter((o) => o.status === "active");
	const pendingInvites = organizations.filter((o) => o.status === "pending");
	const totalMemberships = organizations.length;

	return (
		<div className="mx-auto min-h-[calc(100vh-9rem)] w-full max-w-7xl p-4 sm:p-6 lg:p-8">
			<CreateOrgModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={fetchOrganizations}
			/>

			{/* Page Header */}
			<section className="mb-8 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50 p-6 shadow-sm sm:p-8">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="font-semibold text-blue-700 text-sm uppercase tracking-wide">
							Organization Hub
						</p>
						<h1 className="mt-2 font-bold text-3xl text-gray-900 sm:text-4xl">
							Your Organizations
						</h1>
						<p className="mt-3 max-w-2xl text-gray-600 text-sm sm:text-base">
							Create, join, and manage all your organizations.
						</p>
						<div className="mt-4 flex flex-wrap gap-3 text-sm">
							<span className="rounded-full border border-blue-200 bg-white px-3 py-1 font-medium text-blue-700">
								{activeOrgs.length} Active
							</span>
							<span className="rounded-full border border-orange-200 bg-white px-3 py-1 font-medium text-orange-700">
								{pendingInvites.length} Pending Invites
							</span>
							<span className="rounded-full border border-gray-200 bg-white px-3 py-1 font-medium text-gray-700">
								{totalMemberships} Total Memberships
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-sm text-white shadow-sm transition-colors hover:bg-blue-700"
					>
						+ New Organization
					</button>
				</div>
			</section>

			{/* Pending Invitations */}
			{pendingInvites.length > 0 && (
				<section className="mb-10">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="font-bold text-gray-900 text-xl sm:text-2xl">
							Pending Invitations
						</h2>
						<span className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-700 text-xs">
							{pendingInvites.length} Awaiting Response
						</span>
					</div>

					<div className="grid gap-4 lg:grid-cols-2">
						{pendingInvites.map((invite) => (
							<article
								key={invite.org_id}
								className="rounded-xl border border-orange-200 bg-orange-50 p-5 shadow-sm"
							>
								<h3 className="font-semibold text-gray-900 text-lg">
									{invite.Organization?.name || "Organization Invite"}
								</h3>
								<p className="mt-1 text-gray-600 text-sm">
									You have been invited to join this organization.
								</p>

								<div className="mt-4 flex gap-3">
									<button
										type="button"
										onClick={() => handleInviteAction(invite.org_id, "accept")}
										className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-green-700"
									>
										Accept
									</button>
									<button
										type="button"
										onClick={() => handleInviteAction(invite.org_id, "decline")}
										className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 font-medium text-red-600 text-sm transition-colors hover:bg-red-50"
									>
										Decline
									</button>
								</div>
							</article>
						))}
					</div>
				</section>
			)}

			{/* Organizations */}
			<section>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-bold text-gray-900 text-xl sm:text-2xl">
						My Organizations
					</h2>
				</div>

				{loading ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={`org-loading-${index}`}
								className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white"
							/>
						))}
					</div>
				) : activeOrgs.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{activeOrgs.map((org) => {
							const orgData = org.Organization || org;
							return (
								<Link
									key={orgData.id}
									to={`/orgs/${orgData.id}/overview`}
									className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								>
									<div className="flex h-full flex-col justify-between gap-4">
										<div>
											<p className="font-semibold text-blue-600 text-xs uppercase tracking-wider">
												Organization
											</p>
											<h3 className="mt-2 font-semibold text-gray-900 text-lg transition-colors group-hover:text-blue-700">
												{orgData.name}
											</h3>
										</div>

										<div className="flex items-center justify-between">
											<span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 text-xs">
												Active
											</span>
											<span className="font-semibold text-blue-600 text-sm transition-transform group-hover:translate-x-0.5">
												Open ->
											</span>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				) : (
					<div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
						<p className="font-medium text-gray-700 text-lg">
							You are not in any organizations yet.
						</p>
						<p className="mt-2 text-gray-500 text-sm">
							Create your first organization to start managing shows, members, and inventory.
						</p>
						<button
							type="button"
							onClick={() => setIsModalOpen(true)}
							className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700"
						>
							Create Organization
						</button>
					</div>
				)}
			</section>
		</div>
	);
}
