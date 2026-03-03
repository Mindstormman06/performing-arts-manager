import { useState } from "react";
import { createGlobalInventoryItem } from "../services/api";

export default function CreateInventoryModal({ isOpen, onClose, orgId, departments, userRoles, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        dept_id: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    // Filter departments based on user permissions
    const isSuperAdmin = userRoles.includes("admin") || userRoles.includes("president");
    const allowedDepartments = departments.filter(dept => 
        isSuperAdmin || userRoles.includes(dept.name.toLowerCase())
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Add Global Inventory Item</h2>
                
                {allowedDepartments.length === 0 ? (
                    <div className="mb-4 rounded bg-red-50 p-4 text-red-600">
                        You do not have permission to add inventory to any departments.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}
                        
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Item Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
                            <select
                                required
                                value={formData.dept_id}
                                onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select a department...</option>
                                {allowedDepartments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                required
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isLoading ? "Adding..." : "Add Item"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}