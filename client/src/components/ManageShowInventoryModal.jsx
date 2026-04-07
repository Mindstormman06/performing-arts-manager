import { useEffect, useState } from "react";
import {
	createShowItem,
	getGlobalInventory,
	pullGlobalItemToShow,
} from "../services/api";
import {
	ModalCancelButton,
	ModalDropdown,
	ModalError,
	ModalInput,
	ModalLabel,
	ModalSubmitButton,
	ModalTextarea,
	ModalWrapper,
} from "./ui/modals";

export default function ManageShowInventoryModal({
	isOpen,
	onClose,
	showId,
	orgId,
	departments,
	userRoles,
	currentInventory,
	onSuccess,
}) {
	const [activeTab, setActiveTab] = useState("pull"); // 'pull' or 'create'
	const [globalItems, setGlobalItems] = useState([]);

	// Create Form State
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		dept_id: "",
	});

	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Fetch global items when the "Pull" tab is active
	useEffect(() => {
		if (isOpen && activeTab === "pull") {
			getGlobalInventory(orgId)
				.then((res) => setGlobalItems(res.data))
				.catch(console.error);
		}
	}, [isOpen, activeTab, orgId]);

	if (!isOpen) return null;

	const isSuperAdmin =
		userRoles.includes("director") ||
		userRoles.includes("stage-manager") ||
		userRoles.includes("admin");
	const allowedDepartments = departments.filter(
		(dept) => isSuperAdmin || userRoles.includes(dept.name.toLowerCase()),
	);

	// Filter out global items that are already in the show, OR that the user doesn't have dept access to
	const availableGlobalItems = globalItems.filter((item) => {
		const isAlreadyInShow = currentInventory.some(
			(showItem) => showItem.id === item.id,
		);
		const hasDeptAccess =
			isSuperAdmin || userRoles.includes(item.Department?.name?.toLowerCase());
		return !isAlreadyInShow && hasDeptAccess;
	});

	const handleCreateSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		try {
			await createShowItem(showId, formData);
			setFormData({ name: "", description: "", dept_id: "" });
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create custom item");
		} finally {
			setIsLoading(false);
		}
	};

	const handlePullItem = async (itemId) => {
		setError("");
		try {
			await pullGlobalItemToShow(showId, itemId);
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to pull item");
		}
	};

	return (
		<ModalWrapper>
			<div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-bold text-2xl text-gray-800">
						Add to Show Inventory
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="font-bold text-gray-400 text-xl hover:text-gray-600"
					>
						&times;
					</button>
				</div>

				{/* Tabs */}
				<div className="mb-4 flex border-gray-200 border-b">
					<button
						type="button"
						className={`px-4 py-2 font-medium transition-colors ${activeTab === "pull" ? "border-blue-600 border-b-2 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
						onClick={() => setActiveTab("pull")}
					>
						Pull from Global Stock
					</button>
					<button
						type="button"
						className={`px-4 py-2 font-medium transition-colors ${activeTab === "create" ? "border-blue-600 border-b-2 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
						onClick={() => setActiveTab("create")}
					>
						Create Custom/Consumable Item
					</button>
				</div>

				{error && <ModalError>{error}</ModalError>}

				<div className="flex-1 overflow-y-auto">
					{/* --- PULL TAB --- */}
					{activeTab === "pull" && (
						<div className="space-y-2 pr-2">
							{availableGlobalItems.length > 0 ? (
								availableGlobalItems.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
									>
										<div>
											<div className="font-semibold text-gray-800">
												{item.name}
											</div>
											<div className="text-gray-500 text-sm">
												{item.Department?.name} • {item.description}
											</div>
										</div>
										<button
											type="button"
											onClick={() => handlePullItem(item.id)}
											className="rounded bg-blue-100 px-3 py-1 font-medium text-blue-700 transition-colors hover:bg-blue-200"
										>
											Pull
										</button>
									</div>
								))
							) : (
								<p className="py-8 text-center text-gray-500 italic">
									No available global stock to pull for your departments.
								</p>
							)}
						</div>
					)}

					{/* --- CREATE TAB --- */}
					{activeTab === "create" &&
						(allowedDepartments.length === 0 ? (
							<div className="rounded bg-red-50 p-4 text-red-600">
								You do not have permission to add inventory to any departments.
							</div>
						) : (
							<form
								id="create-item-form"
								onSubmit={handleCreateSubmit}
								className="space-y-4"
							>
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
							</form>
						))}
				</div>

				{/* Footer Buttons (Only needed for Create tab since Pull has inline buttons) */}
				{activeTab === "create" && allowedDepartments.length > 0 && (
					<div className="mt-6 flex justify-end gap-3 border-gray-100 border-t pt-4">
						<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
						<ModalSubmitButton
							type="submit"
							form="create-item-form"
							disabled={isLoading}
						>
							{isLoading ? "Creating..." : "Create Show Item"}
						</ModalSubmitButton>
					</div>
				)}
			</div>
		</ModalWrapper>
	);
}
