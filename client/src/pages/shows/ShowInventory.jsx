import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getShowInventory, getDepartments, getShowUsers, verifyToken, removeShowItem } from "../../services/api.js";
import DashboardSection from "../../components/ui/DashboardSection.jsx";
import ManageShowInventoryModal from "../../components/modals/Shows/ManageShowInventoryModal.jsx";
import InventoryPhotoCell from "../../components/inventory/InventoryPhotoCell.jsx";

export default function ShowInventory() {
    const { orgId, showId } = useParams();
    const [items, setItems] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const authRes = await verifyToken();
            const currentUserId = authRes.data.user.id;

            const [itemsRes, deptsRes, usersRes] = await Promise.all([
                getShowInventory(showId),
                getDepartments(),
                getShowUsers(showId)
            ]);

            setItems(itemsRes.data);
            setDepartments(deptsRes.data);

            const myMembership = usersRes.data.find(u => u.User?.id === currentUserId || u.users_id === currentUserId);
            if (myMembership && myMembership.assignedRoles) {
                setUserRoles(myMembership.assignedRoles.map(r => r.name.toLowerCase()));
            }
        } catch (err) {
            console.error("Failed to fetch show inventory data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [showId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const canManageDept = (deptName) => {
        if (!deptName) return false;
        if (userRoles.includes("director") || userRoles.includes("stage-manager") || userRoles.includes("admin")) return true;
        return userRoles.includes(deptName.toLowerCase());
    };

    const handleRemove = async (itemId, itemName, isGlobal) => {
        const warning = isGlobal 
            ? `Remove "${itemName}" from this show? (It will return to global stock).` 
            : `Permanently delete custom item "${itemName}"?`;
            
        if (window.confirm(warning)) {
            try {
                await removeShowItem(showId, itemId);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || "Failed to remove item");
            }
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = selectedDept === "All" || item.Department?.name === selectedDept;
        return matchesSearch && matchesDept;
    });

    const hasAnyAddPermission = userRoles.includes("director") || userRoles.includes("stage-manager") || userRoles.includes("admin") || 
        departments.some(d => userRoles.includes(d.name.toLowerCase()));

    if (isLoading) {
        return <div className="flex h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">Loading Show Inventory...</div>;
    }

    return (
        <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link to={`/orgs/${orgId}/shows/${showId}`} className="text-sm font-medium text-blue-600 hover:underline">
                        &larr; Back to Show Dashboard
                    </Link>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900">Show Inventory</h1>
                </div>
            </div>

            <ManageShowInventoryModal 
                isOpen={isManageModalOpen}
                onClose={() => setIsManageModalOpen(false)}
                showId={showId}
                orgId={orgId}
                departments={departments}
                userRoles={userRoles}
                currentInventory={items}
                onSuccess={fetchData}
            />

            <DashboardSection 
                title="Items Assigned to this Show"
                actionTitle="Manage Inventory"
                onActionClick={hasAnyAddPermission ? () => setIsManageModalOpen(true) : undefined}
                className="flex-1"
            >
                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    <input type="text" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64">
                        <option value="All">All Departments</option>
                        {departments.map(dept => <option key={dept.id} value={dept.name}>{dept.name}</option>)}
                    </select>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Photo</th>
                                <th className="px-6 py-4 font-semibold">Item Name</th>
                                <th className="px-6 py-4 font-semibold">Department</th>
                                <th className="px-6 py-4 font-semibold">Origin</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.length > 0 ? filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <InventoryPhotoCell photoPath={item.photo_path} itemName={item.name} />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                    <td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100">{item.Department?.name || "Unknown"}</span></td>
                                    <td className="px-6 py-4">
                                        {item.is_global ? 
                                            <span className="text-purple-600 font-medium text-xs bg-purple-50 px-2 py-1 rounded">Global Stock</span> : 
                                            <span className="text-amber-600 font-medium text-xs bg-amber-50 px-2 py-1 rounded">Custom Show Item</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {canManageDept(item.Department?.name) ? (
                                            <button onClick={() => handleRemove(item.id, item.name, item.is_global)} className="text-red-600 hover:text-red-800 font-medium transition-colors">Remove</button>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">View Only</span>
                                        )}
                                    </td>
                                </tr>
                            )) : <tr><td colSpan="5" className="px-6 py-8 text-center italic text-gray-500">No inventory items assigned to this show.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </DashboardSection>
        </div>
    );
}