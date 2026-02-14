import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoleModal from "../components/OrgRoleModal";
import {
	getOrganizationUsers,
	inviteByEmail,
	removeUserFromOrganization,
} from "../services/api";

export default function UserManagement() {
	const { orgId } = useParams();
	const [members, setMembers] = useState([]);
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [_error, setError] = useState("");
	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const fetchMembers = useCallback(async () => {
		try {
			const { data } = await getOrganizationUsers(orgId);
			setMembers(data);
		} catch (err) {
			console.error("Failed to fetch members:", err);
		}
	}, [orgId]);

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	const handleInvite = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await inviteByEmail(orgId, email);
			setEmail("");
			fetchMembers();
			alert("Invitation sent successfully!");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to send invitation");
		} finally {
			setLoading(false);
		}
	};

	const activeMembers = members.filter((m) => m.status === "active");
	const pendingMembers = members.filter((m) => m.status === "pending");

	return (
		<div className="mx-auto max-w-5xl p-6">
			<RoleModal
				isOpen={isRoleModalOpen}
				user={selectedUser}
				orgId={orgId}
				onClose={() => setIsRoleModalOpen(false)}
				onSuccess={fetchMembers}
			/>
			<h2 className="mb-8 font-bold text-3xl">Manage Organization Users</h2>

			{/* Invite Form */}
			<section className="mb-8 rounded-lg bg-white p-6 shadow-md">
				<h3 className="mb-4 font-semibold text-lg">Invite New Member</h3>
				<form onSubmit={handleInvite} className="flex gap-4">
					<input
						type="email"
						placeholder="user@example.com"
						className="flex-1 rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<button
						type="submit"
						disabled={loading}
						className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
					>
						{loading ? "Sending..." : "Send Invite"}
					</button>
				</form>
			</section>

			{/* Active Members Grid */}
			<section className="mb-8">
				<h3 className="mb-4 font-semibold text-gray-700 text-xl">
					Active Members
				</h3>
				<div className="overflow-hidden rounded-lg bg-white shadow">
					{/* Grid Header */}
					<div className="grid grid-cols-12 gap-4 border-b bg-gray-50 p-4 font-semibold text-gray-700">
						<div className="col-span-3">Name</div>
						<div className="col-span-3">Email</div>
						<div className="col-span-4">Roles</div>
						<div className="col-span-2 text-right">Actions</div>
					</div>

					{/* Grid Items */}
					<div className="divide-y divide-gray-200">
						{activeMembers.map((m) => (
							<div
								key={m.assignment_id}
								className="grid grid-cols-12 items-center gap-4 p-4 hover:bg-gray-50"
							>
								<div className="col-span-3 font-medium">
									{m.User?.fname} {m.User?.lname}
								</div>
								<div className="col-span-3 text-gray-600">{m.User?.email}</div>
								<div className="col-span-4">
									<div className="flex flex-wrap gap-1">
										{m.assignedRoles?.map((role) => (
											<span
												key={role.id}
												className="rounded bg-blue-100 px-2 py-1 text-blue-800 text-xs"
											>
												{role.name}
											</span>
										))}
									</div>
								</div>
								<div className="col-span-2 flex justify-end space-x-3">
									<button
										type="button"
										onClick={() => {
											setSelectedUser(m);
											setIsRoleModalOpen(true);
										}}
										className="cursor-pointer font-medium text-blue-600 text-sm transition-colors hover:text-blue-800"
									>
										Edit Roles
									</button>
									<button
										type="button"
										onClick={() =>
											removeUserFromOrganization(orgId, m.users_id).then(
												fetchMembers,
											)
										}
										className="cursor-pointer font-medium text-red-600 text-sm transition-colors hover:text-red-800"
									>
										Remove
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Pending Invites */}
			{pendingMembers.length > 0 && (
				<section>
					<h3 className="mb-4 font-semibold text-orange-600 text-xl">
						Pending Invitations
					</h3>
					<div className="rounded-lg bg-white shadow">
						{pendingMembers.map((m) => (
							<div
								key={m.assignment_id}
								className="flex items-center justify-between border-b p-4"
							>
								<span>{m.User?.email}</span>
								<button
									type="button"
									onClick={() =>
										removeUserFromOrganization(orgId, m.users_id).then(
											fetchMembers,
										)
									}
									className="text-gray-500 text-sm hover:text-red-600"
								>
									Rescind
								</button>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
