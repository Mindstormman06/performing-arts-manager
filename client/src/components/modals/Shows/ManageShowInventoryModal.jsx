import { useEffect, useState } from "react";
import {
	createShowItem,
	createShowItemWithPhoto,
	getGlobalInventory,
	pullGlobalItemToShow,
} from "../../../services/api.js";
import InventoryPhotoCell from "../../ui/InventoryPhotoCell.jsx";
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
	ModalNav,
	ModalNavItem,
	ModalSubmitButton,
	ModalSubWrapper,
	ModalTextarea,
	ModalWrapper,
} from "../../ui/modals/index.js";

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

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		dept_id: "",
	});
	const [photoFile, setPhotoFile] = useState(null);
	const [photoPreview, setPhotoPreview] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setActiveTab("pull");
			setFormData({ name: "", description: "", dept_id: "" });
			setPhotoFile(null);
			setPhotoPreview(null);
			setError("");
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen && activeTab === "pull") {
			getGlobalInventory(orgId)
				.then((res) => setGlobalItems(res.data))
				.catch(() => setError("Failed to load global inventory"));
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

	const availableGlobalItems = globalItems.filter((item) => {
		const isAlreadyInShow = currentInventory.some(
			(showItem) => showItem.id === item.id,
		);
		const hasDeptAccess =
			isSuperAdmin || userRoles.includes(item.Department?.name?.toLowerCase());
		return !isAlreadyInShow && hasDeptAccess;
	});

	const handleCreateItem = async () => {
		if (!formData.name || !formData.dept_id || !formData.description) {
			setError("Please fill in all required fields.");
			setActiveTab("create");
			return;
		}

		setError("");
		setIsLoading(true);
		try {
			if (photoFile) {
				const formDataWithPhoto = new FormData();
				formDataWithPhoto.append("name", formData.name);
				formDataWithPhoto.append("description", formData.description);
				formDataWithPhoto.append("dept_id", formData.dept_id);
				formDataWithPhoto.append("photo", photoFile);

				await createShowItemWithPhoto(showId, formDataWithPhoto);
			} else {
				await createShowItem(showId, formData);
			}

			setFormData({ name: "", description: "", dept_id: "" });
			setPhotoFile(null);
			setPhotoPreview(null);
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create custom item");
		} finally {
			setIsLoading(false);
		}
	};

	const handlePullItem = async (itemId) => {
		setIsLoading(true);
		setError("");
		try {
			await pullGlobalItemToShow(showId, itemId);
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to pull item");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Add to Show Inventory</ModalHeader>

				<ModalNav>
					<ModalNavItem
						isActive={activeTab === "pull"}
						onClick={() => setActiveTab("pull")}
					>
						Pull from Global Stock
					</ModalNavItem>
					<ModalNavItem
						isActive={activeTab === "create"}
						onClick={() => setActiveTab("create")}
					>
						Create Item
					</ModalNavItem>
				</ModalNav>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					{activeTab === "pull" && (
						<div className="max-h-120 overflow-y-auto pr-1">
							{availableGlobalItems.length > 0 ? (
								<div className="space-y-3">
									{availableGlobalItems.map((item) => (
										<article
											key={item.id}
											className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
										>
											<div className="grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center">
												<div className="flex justify-center sm:justify-start">
													<div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-3 shadow-sm">
														<div className="origin-center scale-110">
															<InventoryPhotoCell
																photoPath={item.photo_path}
																itemName={item.name}
															/>
														</div>
													</div>
												</div>

												<div className="min-w-0">
													<div className="flex flex-wrap items-start justify-between gap-3">
														<div className="min-w-0">
															<h3 className="truncate font-semibold text-gray-900 text-lg">
																{item.name}
															</h3>
															<p className="mt-1 text-gray-600 text-sm leading-6">
																{item.description}
															</p>
														</div>

														<span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-semibold text-blue-700 text-xs">
															{item.Department?.name || "Unknown"}
														</span>
													</div>
												</div>

												<div className="flex justify-end sm:pl-2">
													<button
														type="button"
														onClick={() => handlePullItem(item.id)}
														disabled={isLoading}
														className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 font-semibold text-sm text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
													>
														Pull
													</button>
												</div>
											</div>
										</article>
									))}
								</div>
							) : (
								<p className="py-8 text-center text-gray-500 italic">
									No available global stock to pull for your departments.
								</p>
							)}
						</div>
					)}

					{activeTab === "create" &&
						(allowedDepartments.length === 0 ? (
							<ModalError>
								You do not have permission to add inventory to any departments.
							</ModalError>
						) : (
							<ModalInputParent>
								<ModalInputContainer>
									<ModalLabel htmlFor="create-show-item-name">
										Item Name
									</ModalLabel>
									<ModalInput
										id="create-show-item-name"
										type="text"
										required
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
									/>
								</ModalInputContainer>

								<ModalInputContainer>
									<ModalLabel htmlFor="create-show-item-department">
										Department
									</ModalLabel>
									<ModalDropdown
										id="create-show-item-department"
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
									<ModalLabel htmlFor="create-show-item-description">
										Description
									</ModalLabel>
									<ModalTextarea
										id="create-show-item-description"
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
										id="create-show-item-photo"
										label="Photo (Optional)"
										value={photoFile}
										onChange={setPhotoFile}
										onPreview={setPhotoPreview}
										previewUrl={photoPreview}
									/>
								</ModalInputContainer>
							</ModalInputParent>
						))}
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
					{activeTab === "create" && allowedDepartments.length > 0 && (
						<ModalSubmitButton
							type="button"
							onClick={handleCreateItem}
							disabled={isLoading}
						>
							{isLoading ? "Creating..." : "Create Show Item"}
						</ModalSubmitButton>
					)}
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
