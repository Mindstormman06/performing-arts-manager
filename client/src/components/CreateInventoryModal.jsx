import { useState } from "react";
import { createGlobalInventoryItem } from "../services/api";
import {
	ModalCancelButton,
	ModalDropdown,
	ModalInput,
	ModalLabel,
	ModalSubmitButton,
	ModalTextarea,
	ModalWrapper,
} from "./ui/modals";

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
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	if (!isOpen) return null;

	// Filter departments based on user permissions
	const isSuperAdmin =
		userRoles.includes("admin") || userRoles.includes("president");
	const allowedDepartments = departments.filter(
		(dept) => isSuperAdmin || userRoles.includes(dept.name.toLowerCase()),
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			await createGlobalInventoryItem(orgId, formData);
			setFormData({ name: "", description: "", dept_id: "" });
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create item");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
				<h2 className="mb-4 font-bold text-2xl text-gray-800">
					Add Global Inventory Item
				</h2>

				{allowedDepartments.length === 0 ? (
					<div className="mb-4 rounded bg-red-50 p-4 text-red-600">
						You do not have permission to add inventory to any departments.
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						{error && (
							<div className="rounded bg-red-50 p-3 text-red-600 text-sm">
								{error}
							</div>
						)}

						<div>
							<ModalLabel>Item Name</ModalLabel>
							<ModalInput
								type="text"
								required
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</div>

						<div>
							<ModalLabel>Department</ModalLabel>
							<ModalDropdown
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
						</div>

						<div>
							<ModalLabel>Description</ModalLabel>
							<ModalTextarea
								required
								rows="3"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>

						<div className="mt-6 flex justify-end gap-3">
							<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
							<ModalSubmitButton type="submit" disabled={isLoading}>
								{isLoading ? "Adding..." : "Add Item"}
							</ModalSubmitButton>
						</div>
					</form>
				)}
			</div>
		</ModalWrapper>
	);
}
