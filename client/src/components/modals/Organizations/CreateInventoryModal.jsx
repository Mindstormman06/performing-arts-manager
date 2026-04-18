import { useState } from "react";
import {
	createGlobalInventoryItem,
	createGlobalInventoryItemWithPhoto,
} from "../../../services/api.js";
import {
	ModalBody,
	ModalCancelButton,
	ModalDropdown,
	ModalError,
	ModalFooter,
	ModalHeader,
	ModalImageInput,
	ModalInput,
	ModalInputContainer,
	ModalInputParent,
	ModalLabel,
	ModalSubmitButton,
	ModalSubWrapper,
	ModalTextarea,
	ModalWrapper,
} from "../../ui/modals/index.js";

export default function CreateInventoryModal({
	isOpen,
	onClose,
	orgId,
	departments,
	userRoles,
	onSuccess,
}) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		dept_id: "",
	});
	const [photoFile, setPhotoFile] = useState(null);
	const [photoPreview, setPhotoPreview] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Filter departments based on user permissions
	const isSuperAdmin =
		userRoles.includes("admin") || userRoles.includes("president");
	const allowedDepartments = departments.filter(
		(dept) => isSuperAdmin || userRoles.includes(dept.name.toLowerCase()),
	);

	const handleCreateItem = async () => {
		if (!formData.name || !formData.dept_id || !formData.description) {
			setError("Please fill in all required fields.");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			if (photoFile) {
				const formDataWithPhoto = new FormData();
				formDataWithPhoto.append("name", formData.name);
				formDataWithPhoto.append("description", formData.description);
				formDataWithPhoto.append("dept_id", formData.dept_id);
				formDataWithPhoto.append("photo", photoFile);
				await createGlobalInventoryItemWithPhoto(orgId, formDataWithPhoto);
			} else {
				await createGlobalInventoryItem(orgId, formData);
			}

			setFormData({ name: "", description: "", dept_id: "" });
			setPhotoFile(null);
			setPhotoPreview(null);
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create item");
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	if (allowedDepartments.length === 0) {
		return (
			<ModalWrapper>
				<ModalSubWrapper>
					<ModalHeader>Add Global Inventory Item</ModalHeader>
					<ModalError>
						You do not have permission to add inventory to any departments.
					</ModalError>
				</ModalSubWrapper>
			</ModalWrapper>
		);
	}

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Add Global Inventory Item</ModalHeader>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					<ModalInputParent>
						<ModalInputContainer>
							<ModalLabel htmlFor="create-inventory-name">Item Name</ModalLabel>
							<ModalInput
								id="create-inventory-name"
								type="text"
								required
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</ModalInputContainer>

						<ModalInputContainer>
							<ModalLabel htmlFor="create-inventory-department">
								Department
							</ModalLabel>
							<ModalDropdown
								id="create-inventory-department"
								required
								value={formData.dept_id}
								onChange={(e) =>
									setFormData({ ...formData, dept_id: e.target.value })
								}
							>
								<option value="" disabled>
									Select a department...
								</option>
								{allowedDepartments.map((dept) => (
									<option key={dept.id} value={dept.id}>
										{dept.name}
									</option>
								))}
							</ModalDropdown>
						</ModalInputContainer>

						<ModalInputContainer>
							<ModalLabel htmlFor="create-inventory-description">
								Description
							</ModalLabel>
							<ModalTextarea
								id="create-inventory-description"
								required
								rows="3"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</ModalInputContainer>

						<ModalInputContainer>
							<ModalImageInput
								id="create-inventory-photo"
								label="Photo (Optional)"
								onChange={setPhotoFile}
								onPreview={setPhotoPreview}
								previewUrl={photoPreview}
							/>
						</ModalInputContainer>
					</ModalInputParent>
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
					<ModalSubmitButton
						type="button"
						onClick={handleCreateItem}
						disabled={isLoading}
					>
						{isLoading ? "Adding..." : "Add Item"}
					</ModalSubmitButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
