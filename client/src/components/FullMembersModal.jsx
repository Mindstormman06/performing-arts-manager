import { useState } from "react";
import { removeUserFromOrganization } from "../services/api";
import RoleModal from "./OrgRoleModal";
import { ModalWrapper, ModalSubWrapper, ModalHeader, ModalBody } from "./ui/modals";
import MembersList from "./ui/modals/sections/MembersList.jsx";
import PendingInvitesList from "./ui/modals/sections/PendingInvitesList.jsx";

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
			<RoleModal
				isOpen={isRoleModalOpen}
				user={selectedUser}
				orgId={orgId}
				onClose={() => setIsRoleModalOpen(false)}
				onSuccess={onSuccess}
			/>

			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Organization Members</ModalHeader>

				<ModalBody>
					<MembersList
						members={activeMembers}
						onEditRoles={(member) => {
							setSelectedUser(member);
							setIsRoleModalOpen(true);
						}}
						onRemove={handleRemove}
						emptyMessage="No active members in this organization"
						showStatus={false}
					/>

					<PendingInvitesList
						pendingMembers={pendingMembers}
						onRescind={handleRemove}
					/>
				</ModalBody>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
