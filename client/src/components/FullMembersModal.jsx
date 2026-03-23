import { useState } from "react";
import { removeUserFromOrganization } from "../services/api";
import RoleModal from "./OrgRoleModal";
import { ModalWrapper, ModalSubWrapper } from "./ui/modals";

export default function FullMembersModal({
	isOpen,
	onClose,
	members,
	orgId,
	onSuccess,
}) {
	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	if (!isOpen) return null;

	const activeMembers = members.filter((m) => m.status === "active");
	const pendingMembers = members.filter((m) => m.status === "pending");

	const handleRemove = async (userId) => {
		if (window.confirm("Are you sure you want to remove this user?")) {
			try {
				await removeUserFromOrganization(orgId, userId);
				onSuccess();
			} catch {
				alert("Failed to remove user");
			}
		}
	};

	return (
		<ModalWrapper>
			{/* We render the Role Modal inside here or keep it separate. Keeping it nested for hierarchy */}
			<RoleModal
				isOpen={isRoleModalOpen}
				user={selectedUser}
				orgId={orgId}
				onClose={() => setIsRoleModalOpen(false)}
				onSuccess={onSuccess}
			/>

			<ModalSubWrapper>
				<button
					onClick={onClose}
					type="button"
					className="absolute top-4 right-4 font-bold text-gray-500 text-xl hover:text-gray-800"
				>
					✕
				</button>
				<h2 className="mb-6 font-bold text-2xl">Organization Members</h2>

				{/* Active Members */}
				<div className="mb-8 overflow-hidden rounded-lg border">
					<table className="w-full text-left text-sm">
						<thead className="border-b bg-gray-50 text-gray-700">
							<tr>
								<th className="p-4 font-semibold">Name</th>
								<th className="p-4 font-semibold">Email</th>
								<th className="p-4 font-semibold">Roles</th>
								<th className="p-4 text-right font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{activeMembers.map((m) => (
								<tr key={m.assignment_id} className="hover:bg-gray-50">
									<td className="p-4 font-medium">
										{m.User?.fname} {m.User?.lname}
									</td>
									<td className="p-4 text-gray-600">{m.User?.email}</td>
									<td className="p-4">
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
									</td>
									<td className="flex justify-end space-x-3 p-4">
										<button
											type="button"
											onClick={() => {
												setSelectedUser(m);
												setIsRoleModalOpen(true);
											}}
											className="font-medium text-blue-600 hover:text-blue-800"
										>
											Edit Roles
										</button>
										<button
											type="button"
											onClick={() => handleRemove(m.users_id)}
											className="font-medium text-red-600 hover:text-red-800"
										>
											Remove
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pending Invites */}
				{pendingMembers.length > 0 && (
					<section>
						<h3 className="mb-4 font-semibold text-lg text-orange-600">
							Pending Invitations
						</h3>
						<div className="divide-y rounded-lg border">
							{pendingMembers.map((m) => (
								<div
									key={m.assignment_id}
									className="flex items-center justify-between p-4"
								>
									<span>{m.User?.email}</span>
									<button
										type="button"
										onClick={() => handleRemove(m.users_id)}
										className="text-gray-500 text-sm hover:text-red-600"
									>
										Rescind
									</button>
								</div>
							))}
						</div>
					</section>
				)}
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
