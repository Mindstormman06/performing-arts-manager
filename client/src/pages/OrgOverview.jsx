import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import EditOrgModal from "../components/EditOrgModal";
import FullMembersModal from "../components/FullMembersModal";
import InviteMemberModal from "../components/InviteMemberModal";
import RoleModal from "../components/OrgRoleModal";
import CreateShowModal from "../components/CreateShowModal";
import {
	deleteOrganization,
	getOrganization,
	getOrganizationUsers,
	getOrgShows,
} from "../services/api";
import OrgHeader from "../components/ui/organizations/OrgHeader";
import ShowCard from "../components/ui/shows/ShowCard";
import DashboardSection from "../components/ui/DashboardSection";
import MemberListItem from "../components/ui/users/MemberListItem";

export default function OrgOverview() {
	const { orgId } = useParams();
	const navigate = useNavigate();

	const [organization, setOrganization] = useState(null);
	const [members, setMembers] = useState([]);
	const [shows, setShows] = useState([]);

	const [isLoading, setIsLoading] = useState(true);

	const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [isFullMembersModalOpen, setIsFullMembersModalOpen] = useState(false);
	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isCreateShowModalOpen, setIsCreateShowModalOpen] = useState(false);


	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const [orgRes, usersRes, showsRes] = await Promise.all([
				getOrganization(orgId),
				getOrganizationUsers(orgId),
				getOrgShows(orgId),
			]);
			setOrganization(orgRes.data);
			setMembers(usersRes.data);
			setShows(showsRes.data || []);
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
	const displayMembers = members.filter((m) => 
		m.status === "active" || m.status === "pending"
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

			{/* Dashboard Container */}
			<div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
				{/* Header Section */}
				<OrgHeader 
					name={organization?.name}
					presidentName={presidentName}
					onEdit={() => setIsEditOrgModalOpen(true)}
					onDelete={handleDeleteOrg}
				/>
				<div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50/50 px-8 py-4">
                    <Link 
                        to={`/orgs/${orgId}/inventory`}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600"
                    >
                        <span>📦</span> 
                        Global Inventory Database
                    </Link>
					<Link
						to={`/orgs/${orgId}/scheduling`}
						className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600"
					>
						<span>📅</span>
						Organization Schedule
					</Link>
                </div>
				{/* Main Content Layout */}
				<div className="flex flex-1 flex-col gap-8 p-8 md:flex-row">
					{/* Left Column: Shows */}
					<DashboardSection
						title="Shows"
						actionTitle="Add New Show"
						onActionClick={() => setIsCreateShowModalOpen(true)}
						className="flex-1"
					>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{shows.length > 0 ? (
								shows.map((show) => <ShowCard key={show.id} show={show} />)
							) : (
								<div className="col-span-full flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
									<p className="italic text-gray-500">No shows created yet.</p>
								</div>
							)}
						</div>
					</DashboardSection>

					{/* Right Column: Members */}
					<DashboardSection
						title="Members"
						actionTitle="Invite New Member"
						onActionClick={() => setIsInviteModalOpen(true)}
						isTitleClickable={true}
						onTitleClick={() => setIsFullMembersModalOpen(true)}
						className="w-full md:w-72 lg:w-80"
					>
						<ul className="space-y-3">
							{displayMembers.map((m) => (
								<MemberListItem 
									key={m.assignment_id} 
									member={m} 
									onClick={() => {
										setSelectedUser(m);
										setIsRoleModalOpen(true);
									}}
								/>
							))}
						</ul>
					</DashboardSection>
				</div>
			</div>
		</div>
	);
}
