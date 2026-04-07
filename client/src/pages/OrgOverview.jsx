import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreateShowModal from "../components/CreateShowModal";
import EditOrgModal from "../components/EditOrgModal";
import FullMembersModal from "../components/FullMembersModal";
import InviteMemberModal from "../components/InviteMemberModal";
import RoleModal from "../components/OrgRoleModal";
import DashboardSection from "../components/ui/DashboardSection";
import OrgHeader from "../components/ui/organizations/OrgHeader";
import ShowCard from "../components/ui/shows/ShowCard";
import MemberListItem from "../components/ui/users/MemberListItem";
import {
	deleteOrganization,
	getOrganization,
	getOrganizationUsers,
	getUserShows, // <-- Updated
	verifyToken, // <-- Added
} from "../services/api";

export default function OrgOverview() {
	const { orgId } = useParams();
	const navigate = useNavigate();

	const [organization, setOrganization] = useState(null);
	const [members, setMembers] = useState([]);
	const [shows, setShows] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	// --- RBAC STATE ---
	const [userRoles, setUserRoles] = useState([]);
	const [isSuperAdmin, setIsSuperAdmin] = useState(false);

	const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [isFullMembersModalOpen, setIsFullMembersModalOpen] = useState(false);
	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isCreateShowModalOpen, setIsCreateShowModalOpen] = useState(false);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);

			// 1. Get current user
			const authRes = await verifyToken();
			const currentUserId = authRes.data.user.id;

			const [orgRes, usersRes, showsRes] = await Promise.all([
				getOrganization(orgId),
				getOrganizationUsers(orgId),
				getUserShows(orgId), // <-- Now uses the filtered route
			]);

			setOrganization(orgRes.data);
			setMembers(usersRes.data);
			setShows(showsRes.data || []);

			// 2. Identify current user's roles
			const myMembership = usersRes.data.find(
				(m) => m.users_id === currentUserId || m.User?.id === currentUserId,
			);
			if (myMembership?.assignedRoles) {
				const roles = myMembership.assignedRoles.map((r) =>
					r.name.toLowerCase(),
				);
				setUserRoles(roles);
				setIsSuperAdmin(
					roles.includes("president") || roles.includes("board-member"),
				);
			}
		} catch (err) {
			console.error("Failed to fetch organization data:", err);
		} finally {
			setIsLoading(false);
		}
	}, [orgId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleDeleteOrg = async () => {
		const firstConfirm = window.confirm(
			"Are you sure you want to delete this organization?",
		);
		if (firstConfirm) {
			const secondConfirm = window.confirm(
				"This action is permanent and will delete all associated shows and data. Are you absolutely sure?",
			);
			if (secondConfirm) {
				try {
					await deleteOrganization(orgId);
					navigate("/dashboard");
				} catch (err) {
					alert(err.response?.data?.message || "Failed to delete organization");
				}
			}
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-9rem)] items-center justify-center">
				<div className="font-semibold text-gray-500 text-xl">
					Loading Organization Data...
				</div>
			</div>
		);
	}

	const activeMembers = members.filter((m) => m.status === "active");
	const displayMembers = members.filter(
		(m) => m.status === "active" || m.status === "pending",
	);
	const president = activeMembers.find((m) =>
		m.assignedRoles?.some((role) => role.name === "president"),
	);
	const presidentName = president
		? `${president.User?.fname} ${president.User?.lname}`
		: "Unassigned";

	return (
		<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
			{/* Modals */}
			<EditOrgModal
				isOpen={isEditOrgModalOpen}
				onClose={() => setIsEditOrgModalOpen(false)}
				onSuccess={fetchData}
				org={organization}
			/>
			<InviteMemberModal
				isOpen={isInviteModalOpen}
				onClose={() => setIsInviteModalOpen(false)}
				orgId={orgId}
				onSuccess={fetchData}
			/>
			<FullMembersModal
				isOpen={isFullMembersModalOpen}
				onClose={() => setIsFullMembersModalOpen(false)}
				members={members}
				orgId={orgId}
				onSuccess={fetchData}
			/>
			<RoleModal
				isOpen={isRoleModalOpen}
				onClose={() => setIsRoleModalOpen(false)}
				user={selectedUser}
				orgId={orgId}
				onSuccess={fetchData}
			/>
			<CreateShowModal
				isOpen={isCreateShowModalOpen}
				onClose={() => setIsCreateShowModalOpen(false)}
				onSuccess={fetchData}
				orgId={orgId}
			/>

			<div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
				<OrgHeader
					name={organization?.name}
					presidentName={presidentName}
					onEdit={isSuperAdmin ? () => setIsEditOrgModalOpen(true) : undefined}
					onDelete={
						userRoles.includes("president") ? handleDeleteOrg : undefined
					}
				/>

				{/* RESTRICTED: Quick Links */}
				{isSuperAdmin && (
					<div className="flex items-center gap-4 border-gray-100 border-b bg-gray-50/50 px-8 py-4">
						<Link
							to={`/orgs/${orgId}/inventory`}
							className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-gray-700 text-sm shadow-sm ring-1 ring-gray-300 ring-inset transition-all hover:bg-gray-50 hover:text-blue-600"
						>
							<span>📦</span> Global Inventory Database
						</Link>
						<Link
							to={`/orgs/${orgId}/scheduling`}
							className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-semibold text-gray-700 text-sm shadow-sm ring-1 ring-gray-300 ring-inset transition-all hover:bg-gray-50 hover:text-blue-600"
						>
							<span>📅</span> Organization Schedule
						</Link>
					</div>
				)}

				<div className="flex flex-1 flex-col gap-8 p-8 md:flex-row">
					<DashboardSection
						title="Shows"
						actionTitle={isSuperAdmin ? "Add New Show" : null}
						onActionClick={
							isSuperAdmin ? () => setIsCreateShowModalOpen(true) : undefined
						}
						className="flex-1"
					>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{shows.length > 0 ? (
								shows.map((show) => <ShowCard key={show.id} show={show} />)
							) : (
								<div className="col-span-full flex h-32 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed">
									<p className="text-gray-500 italic">No shows created yet.</p>
								</div>
							)}
						</div>
					</DashboardSection>

					<DashboardSection
						title="Members"
						actionTitle={isSuperAdmin ? "Invite New Member" : null}
						onActionClick={
							isSuperAdmin ? () => setIsInviteModalOpen(true) : undefined
						}
						isTitleClickable={isSuperAdmin}
						onTitleClick={
							isSuperAdmin ? () => setIsFullMembersModalOpen(true) : undefined
						}
						className="w-full md:w-72 lg:w-80"
					>
						<ul className="space-y-3">
							{displayMembers.slice(0, 5).map((m) => (
								<MemberListItem
									key={m.assignment_id}
									member={m}
									onClick={
										isSuperAdmin
											? () => {
													setSelectedUser(m);
													setIsRoleModalOpen(true);
												}
											: undefined
									}
								/>
							))}
							{displayMembers.length > 5 && (
								<li className="mt-4 text-center">
									<button
										type="button"
										onClick={() => setIsFullMembersModalOpen(true)}
										className="font-medium text-blue-600 text-sm hover:underline"
									>
										View all {displayMembers.length} members
									</button>
								</li>
							)}
						</ul>
					</DashboardSection>
				</div>
			</div>
		</div>
	);
}
