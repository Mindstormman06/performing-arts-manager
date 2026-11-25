import { useEffect, useState } from "react";
import { updateOrganizationUserRoles } from "../../../services/api.js";
import {
	ModalBody,
	ModalBox,
	ModalCancelButton,
	ModalCheckbox,
	ModalError,
	ModalFooter,
	ModalHeader,
	ModalLabel,
	ModalSubHeader,
	ModalSubmitButton,
	ModalSubsection,
	ModalSubWrapper,
	ModalWrapper,
} from "../../ui/modals/index.js";

/**
 * A modal for choosing which organization roles a member holds.
 *
 * @remarks
 * Exported as `RoleModal`. Holds the checked roles, reset from the member's
 * current roles each time it opens, plus an error and loading flag. Only a
 * fixed set of department roles is offered as checkboxes. Saving sends the
 * complete role list with `updateOrganizationUserRoles`, then triggers the
 * parent's success callback and closes. Expects a member record with a nested
 * `User`. Renders nothing while closed. Requests go through `services/api.js`,
 * which authenticates with the `token` in `localStorage`.
 */
export default function RoleModal({ isOpen, onClose, onSuccess, orgId, user }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const availableRoles = ["board-member", "costumes", "props", "sets", "tech"];

	const [selectedRoles, setSelectedRoles] = useState([]);

	useEffect(() => {
		if (isOpen && user) {
			setSelectedRoles(user.assignedRoles?.map((r) => r.name) || []);
			setError("");
		}
	}, [isOpen, user]);

	if (!isOpen) return null;

	const handleToggle = (role) => {
		setSelectedRoles((prev) =>
			prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
		);
	};

	const handleSave = async () => {
		setError("");
		setLoading(true);
		try {
			// Roles not offered as checkboxes (e.g. president) are re-sent so the
			// full-list update does not strip them.
			const hiddenRoles =
				user?.assignedRoles
					?.map((r) => r.name)
					.filter((name) => !availableRoles.includes(name)) || [];

			const finalRoles = [...new Set([...selectedRoles, ...hiddenRoles])];

			await updateOrganizationUserRoles(orgId, user.users_id, finalRoles);
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to update roles");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>
					Manage Roles for {user.User.fname}
				</ModalHeader>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					<ModalSubsection>
						<ModalSubHeader>Available Roles</ModalSubHeader>
						<ModalBox>
							{availableRoles.map((role) => (
								<ModalLabel
									key={role}
									variant="checkbox"
									htmlFor={`org-role-${role}`}
								>
									<ModalCheckbox
										id={`org-role-${role}`}
										checked={selectedRoles.includes(role)}
										onChange={() => handleToggle(role)}
									/>
									<span className="capitalize">{role}</span>
								</ModalLabel>
							))}
						</ModalBox>
					</ModalSubsection>
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
					<ModalSubmitButton
						onClick={handleSave}
						type="button"
						disabled={loading}
					>
						{loading ? "Saving..." : "Save"}
					</ModalSubmitButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
