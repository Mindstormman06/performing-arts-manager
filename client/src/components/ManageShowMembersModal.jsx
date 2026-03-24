import { useState, useEffect } from "react";
import { removeUserFromShow, addUserToShow, getOrganizationUsers } from "../services/api";
import ShowRoleModal from "./ShowRoleModal";
import InviteMemberModal from "./InviteMemberModal";
import {
	ModalBody,
	ModalCancelButton,
	ModalDropdown,
	ModalError,
	ModalFooter,
	ModalHeader,
	ModalInputContainer,
	ModalInputParent,
	ModalSubHeader,
	ModalSubsection,
	ModalSubWrapper,
	ModalWrapper
} from "./ui/modals";

export default function ManageShowMembersModal({ isOpen, onClose, members, orgId, showId, onSuccess }) {
	const [orgMembers, setOrgMembers] = useState([]);
    const [selectedOrgUserId, setSelectedOrgUserId] = useState("");

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
			setSelectedOrgUserId("");
			setError("");

			getOrganizationUsers(orgId)
				.then((res) => setOrgMembers(res.data))
				.catch(() => setError("Failed to load organization members"));
        }
    }, [isOpen, orgId]);

	if (!isOpen) return null;

	const handleRemove = async (userId) => {
		if (window.confirm("Are you sure you want to remove this user from the show?")) {
			setIsLoading(true);
			setError("");

			try {
				await removeUserFromShow(showId, userId);
				onSuccess();
			} catch {
				setError("Failed to remove user");
			} finally {
				setIsLoading(false);
			}
		}
	};

    const handleAddOrgMember = async () => {
        if (!selectedOrgUserId) return;

		setIsLoading(true);
		setError("");

        try {
            await addUserToShow(showId, selectedOrgUserId);
            setSelectedOrgUserId("");
            onSuccess();
        } catch (err) {
			setError(err.response?.data?.message || "Failed to add user");
		} finally {
			setIsLoading(false);
        }
    };

	const showMemberIds = members.map((m) => m.users_id);
	const availableOrgMembers = orgMembers.filter((m) => !showMemberIds.includes(m.users_id) && m.status === "active");

	return (
		<ModalWrapper>
            <ShowRoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} user={selectedUser} showId={showId} onSuccess={onSuccess} />
            <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} orgId={orgId} showId={showId} onSuccess={onSuccess} />

			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Manage Show Roster</ModalHeader>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					<ModalInputParent>
						<ModalSubsection>
							<ModalSubHeader>Add New Members</ModalSubHeader>
							<div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row flex-col">
								<div className="flex w-full flex-1 gap-2">
									<ModalInputContainer>
										<ModalDropdown
											value={selectedOrgUserId}
											onChange={(e) => setSelectedOrgUserId(e.target.value)}
										>
											<option value="">-- Add from Organization --</option>
											{availableOrgMembers.map((m) => (
												<option key={m.users_id} value={m.users_id}>
													{m.User?.fname} {m.User?.lname} ({m.User?.email})
												</option>
											))}
										</ModalDropdown>
									</ModalInputContainer>

									<button
										type="button"
										onClick={handleAddOrgMember}
										disabled={!selectedOrgUserId || isLoading}
										className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
									>
										{isLoading ? "Adding..." : "Add"}
									</button>
								</div>

								<div className="hidden font-medium text-gray-400 sm:block">OR</div>

								<button
									type="button"
									onClick={() => setIsInviteModalOpen(true)}
									className="w-full whitespace-nowrap rounded bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 sm:w-auto"
								>
									+ Invite via Email
								</button>
							</div>
						</ModalSubsection>

						<ModalSubsection>
							<ModalSubHeader>Current Roster</ModalSubHeader>
							<div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
								<table className="w-full text-left text-sm">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-4 font-bold text-gray-900">Name</th>
											<th className="px-6 py-4 font-bold text-gray-900">Email</th>
											<th className="px-6 py-4 font-bold text-gray-900">Roles</th>
											<th className="px-6 py-4 text-right font-bold text-gray-900">Actions</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{members.map((m) => (
											<tr key={m.users_id} className="transition-colors hover:bg-gray-50">
												<td className="px-6 py-4 font-medium text-gray-900">
													{m.User?.fname} {m.User?.lname}
													{m.status === "pending" && <span className="ml-2 rounded-full bg-amber-100 px-2 py-1 text-amber-800 text-xs">Pending</span>}
												</td>
												<td className="px-6 py-4 text-gray-500">{m.User?.email}</td>
												<td className="px-6 py-4 text-gray-500">
													<div className="flex flex-wrap gap-1">
														{m.assignedRoles?.map((role) => (
															<span key={role.id} className="rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs capitalize">
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
														disabled={isLoading}
														className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
													>
														Remove
													</button>
												</td>
											</tr>
										))}
										{members.length === 0 && (
											<tr>
												<td colSpan="4" className="py-8 text-center text-gray-500 italic">No members in this show yet.</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</ModalSubsection>
					</ModalInputParent>
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Done</ModalCancelButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}