import { useEffect, useState } from "react";
import {
	addUserToShow,
	getOrganizationUsers,
	removeUserFromShow,
} from "../../../services/api.js";
import {
	ModalBody,
	ModalCancelButton,
	ModalDropdown,
	ModalError,
	ModalFooter,
	ModalHeader,
	ModalSubHeader,
	ModalSubmitButton,
	ModalSubsection,
	ModalSubWrapper,
	ModalWrapper,
} from "../../ui/modals/index.js";
import MembersList from "../../ui/modals/sections/MembersList.jsx";
import InviteMemberModal from "../Organizations/InviteMemberModal.jsx";
import ShowRoleModal from "./ShowRoleModal.jsx";

/**
 * A modal for managing a show's roster: adding organization members, inviting
 * by email, editing roles and removing members.
 *
 * @remarks
 * Holds the organization's members fetched with `getOrganizationUsers` on open,
 * the member picked to add, which nested modal (`ShowRoleModal` or
 * `InviteMemberModal`) is open, an error and a loading flag. Only active
 * organization members not already in the show can be added, via
 * `addUserToShow`; removal asks for `window.confirm` and calls
 * `removeUserFromShow`. Adding, inviting and role editing are shown only when
 * the parent grants edit permission; the current user's id and roles are passed
 * on to `ShowRoleModal` to limit which roles they can assign. Renders nothing
 * while closed. Requests go through `services/api.js`, which authenticates with
 * the `token` in `localStorage`.
 */
export default function ManageShowMembersModal({
	isOpen,
	onClose,
	members,
	orgId,
	showId,
	onSuccess,
	canEditRoles = false,
	currentUserId = null,
	currentUserRoles = [],
}) {
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
				.catch(() => setError("Failed to load organizations members"));
		}
	}, [isOpen, orgId]);

	if (!isOpen) return null;

	const handleRemove = async (userId) => {
		if (
			window.confirm("Are you sure you want to remove this user from the show?")
		) {
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
	const availableOrgMembers = orgMembers.filter(
		(m) => !showMemberIds.includes(m.users_id) && m.status === "active",
	);

	return (
		<ModalWrapper>
			<ShowRoleModal
				isOpen={isRoleModalOpen}
				onClose={() => setIsRoleModalOpen(false)}
				user={selectedUser}
				showId={showId}
				canEditRoles={canEditRoles}
				currentUserId={currentUserId}
				currentUserRoles={currentUserRoles}
				onSuccess={onSuccess}
			/>
			<InviteMemberModal
				isOpen={isInviteModalOpen}
				onClose={() => setIsInviteModalOpen(false)}
				orgId={orgId}
				showId={showId}
				onSuccess={onSuccess}
			/>

			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Manage Show Roster</ModalHeader>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					{canEditRoles && (
						<ModalSubsection>
							<ModalSubHeader>Add New Members</ModalSubHeader>
							<div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row">
								<ModalDropdown
									value={selectedOrgUserId}
									onChange={(e) => setSelectedOrgUserId(e.target.value)}
									className="flex-1"
								>
									<option value="">-- Add from Organization --</option>
									{availableOrgMembers.map((m) => (
										<option key={m.users_id} value={m.users_id}>
											{m.User?.fname} {m.User?.lname} ({m.User?.email})
										</option>
									))}
								</ModalDropdown>

								<ModalSubmitButton
									type="button"
									onClick={handleAddOrgMember}
									disabled={!selectedOrgUserId || isLoading}
								>
									{isLoading ? "Adding..." : "Add"}
								</ModalSubmitButton>

								<div className="hidden font-medium text-gray-400 sm:block">
									OR
								</div>

								<button
									type="button"
									onClick={() => setIsInviteModalOpen(true)}
									className="w-full cursor-pointer whitespace-nowrap rounded bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 sm:w-auto"
								>
									+ Email Invite
								</button>
							</div>
						</ModalSubsection>
					)}

					<ModalSubsection>
						<ModalSubHeader>Current Roster</ModalSubHeader>
						<MembersList
							members={members}
							canEditRoles={canEditRoles}
							onEditRoles={(member) => {
								setSelectedUser(member);
								setIsRoleModalOpen(true);
							}}
							onRemove={handleRemove}
							emptyMessage="No members in this show yet."
							showStatus={true}
						/>
					</ModalSubsection>
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Done</ModalCancelButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
