import { ModalCheckbox, ModalLabel } from "../index.js";

export default function ModalCheckboxItem({ role, isSelected, onToggle }) {
	const checkboxId = `modal-checkbox-role-${role
		.toLowerCase()
		.replace(/[^a-z0-9]+/gi, "-")}`;

	return (
		<ModalLabel key={role} variant={"checkbox"} htmlFor={checkboxId}>
			<ModalCheckbox id={checkboxId} checked={isSelected} onChange={onToggle} />
			<div>
				<div className="font-medium text-sm capitalize">{role}</div>
			</div>
		</ModalLabel>
	);
}
