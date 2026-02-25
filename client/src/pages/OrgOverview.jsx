import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
				<header className="flex items-start justify-between border-gray-200 border-b bg-gray-50 px-8 py-6">
					<div>
						<h1 className="font-extrabold text-5xl text-gray-900 tracking-tight">
							{organization?.name || "Loading..."}
						</h1>
						<p className="mt-2 font-medium text-gray-500 text-lg">
							President: <span className="text-gray-800">{presidentName}</span>
						</p>
					</div>

					{/* Actions */}
					<div className="flex space-x-2">
						<button
							type="button"
							onClick={() => setIsEditOrgModalOpen(true)}
							className="rounded-lg p-2 text-gray-400 text-xl transition-colors hover:bg-blue-50 hover:text-blue-600"
							title="Edit Organization"
						>
							✏️
						</button>
						<button
							type="button"
							onClick={handleDeleteOrg}
							className="rounded-lg p-2 text-gray-400 text-xl transition-colors hover:bg-red-50 hover:text-red-600"
							title="Delete Organization"
						>
							🗑️
						</button>
					</div>
				</header>

				{/* Main Content Layout */}
				<div className="flex flex-1 flex-col gap-8 p-8 md:flex-row">
					{/* Left Column: Shows */}
					<section className="flex flex-1 flex-col">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-bold text-2xl text-gray-800">Shows</h2>
							<button
								type="button"
								onClick={() => {
									setIsCreateShowModalOpen(true);
								}}
								className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-100 pb-1 font-bold text-blue-600 text-xl transition-colors hover:bg-blue-200"
								title="Add New Show"
							>
								+
							</button>
						</div>

						{/* Shows Grid */}
						<div className="min-h-75 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-6">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{shows.length > 0 ? (
									shows.map((show) => (
										<div
											key={show.id}
											className="cursor-pointer rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
										>
											<h3 className="font-bold text-gray-900 text-lg">
												{show.title}
											</h3>
											<p className="mt-1 text-sm text-gray-500">
												{new Date(show.start_date).toLocaleDateString()} - {new Date(show.end_date).toLocaleDateString()}
											</p>
										</div>
									))
								) : (
									<div className="col-span-full flex h-32 items-center justify-center rounded-lg border-2 border-gray-300 border-dashed">
										<p className="text-gray-500 italic">
											No shows created yet.
										</p>
									</div>
								)}
							</div>
						</div>
					</section>

					{/* Right Column: Members */}
					<section className="flex w-full flex-col md:w-72 lg:w-80">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="font-bold text-2xl text-gray-800">
								<button
									type="button"
									className="cursor-pointer rounded outline-none transition-colors hover:text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500"
									onClick={() => setIsFullMembersModalOpen(true)}
									title="View all members and roles"
								>
									Members
								</button>
							</h2>
							<button
								type="button"
								onClick={() => setIsInviteModalOpen(true)}
								className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-100 pb-1 font-bold text-blue-600 text-xl transition-colors hover:bg-blue-200"
								title="Invite New Member"
							>
								+
							</button>
						</div>

						{/* Members List */}
						<div className="min-h-75 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
							<ul className="space-y-3">
								{activeMembers.map((m) => (
									<li key={m.assignment_id}>
										<button
											type="button"
											className="flex w-full cursor-pointer items-center rounded-lg border border-gray-100 bg-white px-4 py-3 text-left font-medium text-gray-700 shadow-sm transition-all hover:border-blue-300 hover:shadow-md focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
											onClick={() => {
												setSelectedUser(m);
												setIsRoleModalOpen(true);
											}}
										>
											<div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 text-sm">
												{m.User?.fname?.charAt(0)}
												{m.User?.lname?.charAt(0)}
											</div>
											<span className="truncate">
												{m.User?.fname} {m.User?.lname}
											</span>
										</button>
									</li>
								))}
							</ul>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
