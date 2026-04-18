import { ModalCheckbox, ModalLabel } from "../index.js";

export default function ModalCheckboxItem({ role, isSelected, onToggle }) {
    return (
        <ModalLabel key={role} variant={"checkbox"}>
            <ModalCheckbox checked={isSelected} onChange={onToggle} />
            <div>
                <div className="text-sm font-medium capitalize">{role}</div>
            </div>
        </ModalLabel>
    )
}