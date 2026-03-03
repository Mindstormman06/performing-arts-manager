import { useState, useEffect } from "react";
import { createShowItem, getGlobalInventory, pullGlobalItemToShow } from "../services/api";

export default function ManageShowInventoryModal({ isOpen, onClose, showId, orgId, departments, userRoles, currentInventory, onSuccess }) {
    const [activeTab, setActiveTab] = useState("pull"); // 'pull' or 'create'
    const [globalItems, setGlobalItems] = useState([]);
    
    // Create Form State
    const [formData, setFormData] = useState({ name: "", description: "", dept_id: "" });
    
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch global items when the "Pull" tab is active
    useEffect(() => {
        if (isOpen && activeTab === "pull") {
            getGlobalInventory(orgId).then(res => setGlobalItems(res.data)).catch(console.error);
        }
    }, [isOpen, activeTab, orgId]);

    if (!isOpen) return null;

    const isSuperAdmin = userRoles.includes("director") || userRoles.includes("stage-manager") || userRoles.includes("admin");
    const allowedDepartments = departments.filter(dept => 
        isSuperAdmin || userRoles.includes(dept.name.toLowerCase())
    );

    // Filter out global items that are already in the show, OR that the user doesn't have dept access to
    const availableGlobalItems = globalItems.filter(item => {
        const isAlreadyInShow = currentInventory.some(showItem => showItem.id === item.id);
        const hasDeptAccess = isSuperAdmin || userRoles.includes(item.Department?.name?.toLowerCase());
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Add to Show Inventory</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                    <button 
                        className={`py-2 px-4 font-medium transition-colors ${activeTab === "pull" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("pull")}
                    >
                        Pull from Global Stock
                    </button>
                    <button 
                        className={`py-2 px-4 font-medium transition-colors ${activeTab === "create" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("create")}
                    >
                        Create Custom/Consumable Item
                    </button>
                </div>

                {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                <div className="flex-1 overflow-y-auto">
                    {/* --- PULL TAB --- */}
                    {activeTab === "pull" && (
                        <div className="space-y-2 pr-2">
                            {availableGlobalItems.length > 0 ? (
                                availableGlobalItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <div className="font-semibold text-gray-800">{item.name}</div>
                                            <div className="text-sm text-gray-500">{item.Department?.name} • {item.description}</div>
                                        </div>
                                        <button 
                                            onClick={() => handlePullItem(item.id)}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition-colors"
                                        >
                                            Pull
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-center py-8">No available global stock to pull for your departments.</p>
                            )}
                        </div>
                    )}

                    {/* --- CREATE TAB --- */}
                    {activeTab === "create" && (
                        allowedDepartments.length === 0 ? (
                            <div className="rounded bg-red-50 p-4 text-red-600">
                                You do not have permission to add inventory to any departments.
                            </div>
                        ) : (
                            <form id="create-item-form" onSubmit={handleCreateSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
                                    <select required value={formData.dept_id} onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option value="" disabled>Select a department...</option>
                                        {allowedDepartments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                                    <textarea required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                                </div>
                            </form>
                        )
                    )}
                </div>

                {/* Footer Buttons (Only needed for Create tab since Pull has inline buttons) */}
                {activeTab === "create" && allowedDepartments.length > 0 && (
                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>
                        <button type="submit" form="create-item-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
                            {isLoading ? "Creating..." : "Create Show Item"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}