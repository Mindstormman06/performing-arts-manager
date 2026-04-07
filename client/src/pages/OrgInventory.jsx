import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CreateInventoryModal from "../components/CreateInventoryModal";
import DashboardSection from "../components/ui/DashboardSection";
import {
	deleteGlobalInventoryItem,
	getDepartments,
	getGlobalInventory,
	getOrganizationUsers,
	verifyToken,
} from "../services/api";

export default function OrgInventory() {
	const { orgId } = useParams();
	const [items, setItems] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [userRoles, setUserRoles] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Filtering states
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDept, setSelectedDept] = useState("All");

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);

			// 1. Get the current user's ID
			const authRes = await verifyToken();
			const currentUserId = authRes.data.user.id;

			// 2. Fetch everything concurrently
			const [itemsRes, deptsRes, usersRes] = await Promise.all([
				getGlobalInventory(orgId),
				getDepartments(),
				getOrganizationUsers(orgId),
			]);

			setItems(itemsRes.data);
			setDepartments(deptsRes.data);

			// 3. Find current user's roles in this org
			const myMembership = usersRes.data.find(
				(u) => u.User?.id === currentUserId || u.users_id === currentUserId,
			);
			if (myMembership?.assignedRoles) {
				setUserRoles(
					myMembership.assignedRoles.map((r) => r.name.toLowerCase()),
				);
			}
		} catch (err) {
			console.error("Failed to fetch inventory data:", err);
		} finally {
			setIsLoading(false);
		}
	}, [orgId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Permission Checker
	const canManageDept = (deptName) => {
		if (!deptName) return false;
		if (userRoles.includes("admin") || userRoles.includes("president"))
			return true;
		return userRoles.includes(deptName.toLowerCase());
	};

	const handleDelete = async (itemId, itemName) => {
		if (
			window.confirm(
				`Are you sure you want to permanently delete "${itemName}"? This will remove it from all shows as well.`,
			)
		) {
			try {
				await deleteGlobalInventoryItem(orgId, itemId);
				fetchData(); // Refresh list
			} catch (err) {
				alert(err.response?.data?.message || "Failed to delete item");
			}
		}
	};

	const filteredItems = items.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesDept =
			selectedDept === "All" || item.Department?.name === selectedDept;
		return matchesSearch && matchesDept;
	});

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-9rem)] items-center justify-center">
				<div className="font-semibold text-gray-500 text-xl">
					Loading Inventory...
				</div>
			</div>
		);
	}

	const hasAnyAddPermission =
		userRoles.includes("admin") ||
		userRoles.includes("president") ||
		departments.some((d) => userRoles.includes(d.name.toLowerCase()));

	return (
		<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
			{/* Header / Breadcrumb navigation */}
			<div className="mb-6 flex items-center justify-between">
				<div>
					<Link
						to={`/orgs/${orgId}/overview`}
						className="font-medium text-blue-600 text-sm hover:underline"
					>
						&larr; Back to Organization
					</Link>
					<h1 className="mt-1 font-bold text-3xl text-gray-900">
						Global Inventory Stock
					</h1>
				</div>
			</div>

			<CreateInventoryModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				orgId={orgId}
				departments={departments}
				userRoles={userRoles}
				onSuccess={fetchData}
			/>

			<DashboardSection
				title="Inventory Database"
				actionTitle="Add New Item"
				onActionClick={
					hasAnyAddPermission ? () => setIsCreateModalOpen(true) : undefined
				}
				className="flex-1"
			>
				{/* Filters */}
				<div className="mb-6 flex flex-col gap-4 sm:flex-row">
					<input
						type="text"
						placeholder="Search items..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
					<select
						value={selectedDept}
						onChange={(e) => setSelectedDept(e.target.value)}
						className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
					>
						<option value="All">All Departments</option>
						{departments.map((dept) => (
							<option key={dept.id} value={dept.name}>
								{dept.name}
							</option>
						))}
					</select>
				</div>

				{/* Data Table */}
				<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
					<table className="w-full text-left text-gray-600 text-sm">
						<thead className="bg-gray-50 text-gray-700">
							<tr>
								<th className="px-6 py-4 font-semibold">Item Name</th>
								<th className="px-6 py-4 font-semibold">Department</th>
								<th className="px-6 py-4 font-semibold">Description</th>
								<th className="px-6 py-4 text-right font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{filteredItems.length > 0 ? (
								filteredItems.map((item) => (
									<tr
										key={item.id}
										className="transition-colors hover:bg-gray-50"
									>
										<td className="px-6 py-4 font-medium text-gray-900">
											{item.name}
										</td>
										<td className="px-6 py-4">
											<span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-semibold text-blue-700 text-xs">
												{item.Department?.name || "Unknown"}
											</span>
										</td>
										<td className="px-6 py-4">{item.description}</td>
										<td className="px-6 py-4 text-right">
											{canManageDept(item.Department?.name) ? (
												<button
													type="button"
													onClick={() => handleDelete(item.id, item.name)}
													className="font-medium text-red-600 transition-colors hover:text-red-800"
												>
													Delete
												</button>
											) : (
												<span className="text-gray-400 text-xs italic">
													View Only
												</span>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="4"
										className="px-6 py-8 text-center text-gray-500 italic"
									>
										No inventory items found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</DashboardSection>
		</div>
	);
}
