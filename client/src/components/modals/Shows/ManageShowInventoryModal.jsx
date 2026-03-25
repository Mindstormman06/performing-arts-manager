import { useState, useEffect } from "react";
import { createShowItem, getGlobalInventory, pullGlobalItemToShow, createShowItemWithPhoto } from "../../../services/api.js";
import {
    ModalCancelButton,
    ModalDropdown,
    ModalError,
    ModalInput,
    ModalImageInput,
    ModalLabel,
    ModalSubmitButton,
    ModalTextarea,
    ModalWrapper,
    ModalSubWrapper,
    ModalHeader,
    ModalNav,
    ModalNavItem,
    ModalBody,
    ModalFooter,
    ModalInputContainer,
    ModalInputParent,
    ModalBox,
} from "../../ui/modals/index.js";

export default function ManageShowInventoryModal({ isOpen, onClose, showId, orgId, departments, userRoles, currentInventory, onSuccess }) {
    const [activeTab, setActiveTab] = useState("pull"); // 'pull' or 'create'
    const [globalItems, setGlobalItems] = useState([]);

    const [formData, setFormData] = useState({ name: "", description: "", dept_id: "" });
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

    const isSuperAdmin = userRoles.includes("director") || userRoles.includes("stage-manager") || userRoles.includes("admin");
    const allowedDepartments = departments.filter(dept => 
        isSuperAdmin || userRoles.includes(dept.name.toLowerCase())
    );

    const availableGlobalItems = globalItems.filter(item => {
        const isAlreadyInShow = currentInventory.some(showItem => showItem.id === item.id);
        const hasDeptAccess = isSuperAdmin || userRoles.includes(item.Department?.name?.toLowerCase());
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
                    <ModalNavItem isActive={activeTab === "pull"} onClick={() => setActiveTab("pull")}>
                        Pull from Global Stock
                    </ModalNavItem>
                    <ModalNavItem isActive={activeTab === "create"} onClick={() => setActiveTab("create")}>
                        Create Custom/Consumable Item
                    </ModalNavItem>
                </ModalNav>

                {error && <ModalError>{error}</ModalError>}

                <ModalBody>
                    {activeTab === "pull" && (
                        <ModalBox>
                            {availableGlobalItems.length > 0 ? (
                                availableGlobalItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                                        <div>
                                            <div className="font-semibold text-gray-800">{item.name}</div>
                                            <div className="text-sm text-gray-500">{item.Department?.name} • {item.description}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handlePullItem(item.id)}
                                            disabled={isLoading}
                                            className="rounded bg-blue-100 px-3 py-1 font-medium text-blue-700 transition-colors hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Pull
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="py-8 text-center text-gray-500 italic">No available global stock to pull for your departments.</p>
                            )}
                        </ModalBox>
                    )}

                    {activeTab === "create" && (
                        allowedDepartments.length === 0 ? (
                            <ModalError>
                                You do not have permission to add inventory to any departments.
                            </ModalError>
                        ) : (
                            <ModalInputParent>
                                <ModalInputContainer>
                                    <ModalLabel htmlFor="create-show-item-name">Item Name</ModalLabel>
                                    <ModalInput id="create-show-item-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </ModalInputContainer>

                                <ModalInputContainer>
                                    <ModalLabel htmlFor="create-show-item-department">Department</ModalLabel>
                                    <ModalDropdown id="create-show-item-department" required value={formData.dept_id} onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })}>
                                        <option value="" disabled>Select a department...</option>
                                        {allowedDepartments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </ModalDropdown>
                                </ModalInputContainer>

                                <ModalInputContainer>
                                    <ModalLabel htmlFor="create-show-item-description">Description</ModalLabel>
                                    <ModalTextarea id="create-show-item-description" required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
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
                        )
                    )}
                </ModalBody>

                <ModalFooter>
                    <ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
                    {activeTab === "create" && allowedDepartments.length > 0 && (
                        <ModalSubmitButton type="button" onClick={handleCreateItem} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Show Item"}
                        </ModalSubmitButton>
                    )}
                </ModalFooter>
            </ModalSubWrapper>
        </ModalWrapper>
    );
}