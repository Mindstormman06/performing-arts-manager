import { ModalCheckbox, ModalLabel } from "../index.js";

/**
 * A labelled checkbox for toggling one role name.
 *
 * @remarks
 * Stateless; the parent controls whether it is checked and handles the toggle.
 * Builds the input id from the role name by lowercasing it and replacing
 * non-alphanumeric runs with dashes, so role names must be unique within one
 * modal.
 */
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
