import { useEffect, useState } from "react";
import {
	ModalBody,
	ModalCancelButton,
	ModalDropdown,
	ModalError,
	ModalFooter,
	ModalHeader,
	ModalInput,
	ModalInputContainer,
	ModalInputParent,
	ModalLabel,
	ModalSubmitButton,
	ModalSubWrapper,
	ModalTextarea,
	ModalWrapper,
} from "../../ui/modals/index.js";

/**
 * A modal form for editing an inventory item's name, description and
 * department.
 *
 * @remarks
 * Holds the form fields, an error and a loading flag, refilled from the item
 * each time the modal opens. Makes no API calls itself: it hands the form
 * values (with a numeric `dept_id`) to the parent's async save callback and
 * closes when that resolves, showing the server's error message if it rejects.
 * The title and submit label can be overridden for reuse. Renders nothing while
 * closed or without an item.
 */
export default function EditInventoryItemModal({
	isOpen,
	onClose,
	item,
	departments,
	onSave,
	submitLabel = "Save Changes",
	title = "Edit Inventory Item",
}) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		dept_id: "",
	});
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && item) {
			setFormData({
				name: item.name || "",
				description: item.description || "",
				dept_id: item.dept_id ? String(item.dept_id) : "",
			});
			setError("");
		}
	}, [isOpen, item]);

	if (!isOpen || !item) return null;

	const handleSubmit = async () => {
		if (!formData.name || !formData.description || !formData.dept_id) {
			setError("Please fill in all required fields.");
			return;
		}

		setError("");
		setIsLoading(true);
		try {
			await onSave({
				name: formData.name,
				description: formData.description,
				dept_id: Number(formData.dept_id),
			});
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to update item");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>{title}</ModalHeader>
				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					<ModalInputParent>
						<ModalInputContainer>
							<ModalLabel htmlFor="edit-inventory-name">Item Name</ModalLabel>
							<ModalInput
								id="edit-inventory-name"
								type="text"
								required
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</ModalInputContainer>

						<ModalInputContainer>
							<ModalLabel htmlFor="edit-inventory-department">
								Department
							</ModalLabel>
							<ModalDropdown
								id="edit-inventory-department"
								required
								value={formData.dept_id}
								onChange={(e) =>
									setFormData({ ...formData, dept_id: e.target.value })
								}
							>
								<option value="" disabled>
									Select a department...
								</option>
								{departments.map((dept) => (
									<option key={dept.id} value={dept.id}>
										{dept.name}
									</option>
								))}
							</ModalDropdown>
						</ModalInputContainer>

						<ModalInputContainer>
							<ModalLabel htmlFor="edit-inventory-description">
								Description
							</ModalLabel>
							<ModalTextarea
								id="edit-inventory-description"
								required
								rows="3"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</ModalInputContainer>
					</ModalInputParent>
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
					<ModalSubmitButton
						type="button"
						onClick={handleSubmit}
						disabled={isLoading}
					>
						{isLoading ? "Saving..." : submitLabel}
					</ModalSubmitButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
