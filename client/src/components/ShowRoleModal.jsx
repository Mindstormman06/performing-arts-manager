import { useEffect, useState } from "react";
import { updateShowUserRoles } from "../services/api";
import {
	ModalCancelButton,
	ModalCheckbox,
	ModalSubmitButton,
	ModalSubWrapper,
	ModalWrapper,
} from "./ui/modals";

export default function ShowRoleModal({
	isOpen,
	onClose,
	onSuccess,
	showId,
	user,
}) {
	const [loading, setLoading] = useState(false);

	const availableRoles = [
		"director",
		"stage-manager",
		"actor",
		"costumes",
		"props",
		"sets",
		"tech",
	];

	const [selectedRoles, setSelectedRoles] = useState([]);

	useEffect(() => {
		if (isOpen && user) {
			setSelectedRoles(user.assignedRoles?.map((r) => r.name) || []);
		}
	}, [isOpen, user]);

	if (!isOpen) return null;

	const handleToggle = (role) => {
		setSelectedRoles((prev) =>
			prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
		);
	};

	const handleSave = async () => {
		setLoading(true);
		try {
			const hiddenRoles =
				user?.assignedRoles
					?.map((r) => r.name)
					.filter((name) => !availableRoles.includes(name)) || [];

			const finalRoles = [...new Set([...selectedRoles, ...hiddenRoles])];

			await updateShowUserRoles(showId, user.users_id, finalRoles);
			onSuccess();
			onClose();
		} catch (err) {
			alert(
				`Failed to update roles: ${err.response?.data?.message || err.message}`,
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<h3 className="mb-4 font-bold">Manage Roles for {user.User?.fname}</h3>
				<div className="mb-6 space-y-2">
					{availableRoles.map((role) => {
						const roleId = `role-${role}`;
						return (
							<label
								key={role}
								htmlFor={roleId}
								className="flex items-center space-x-2 capitalize"
							>
								<ModalCheckbox
									id={roleId}
									checked={selectedRoles.includes(role)}
									onChange={() => handleToggle(role)}
								/>
								<span>{role}</span>
							</label>
						);
					})}
				</div>
				<div className="flex justify-end gap-2">
					<ModalCancelButton onClick={onClose} disabled={loading}>
						Cancel
					</ModalCancelButton>
					<ModalSubmitButton
						onClick={handleSave}
						disabled={loading}
						type="button"
					>
						{loading ? "Saving..." : "Save"}
					</ModalSubmitButton>
				</div>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
