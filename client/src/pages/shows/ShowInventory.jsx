import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditInventoryItemModal from "../../components/modals/Inventory/EditInventoryItemModal.jsx";
import ManageShowInventoryModal from "../../components/modals/Shows/ManageShowInventoryModal.jsx";
import DashboardSection from "../../components/ui/DashboardSection.jsx";
import InventoryItemCard from "../../components/ui/inventory/InventoryItemCard.jsx";
import {
	assignShowInventoryItem,
	getDepartments,
	getShowCasting,
	getShowInventory,
	getShowUsers,
	removeShowItem,
	updateShowInventoryItem,
	verifyToken,
} from "../../services/api.js";

export default function ShowInventory() {
	const { orgId, showId } = useParams();
	const [items, setItems] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [userRoles, setUserRoles] = useState([]);
	const [showMembers, setShowMembers] = useState([]);
	const [characters, setCharacters] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isManageModalOpen, setIsManageModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [assigningItemId, setAssigningItemId] = useState(null);
	const [selectedItem, setSelectedItem] = useState(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedDept, setSelectedDept] = useState("All");

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const authRes = await verifyToken();
			const currentUserId = authRes.data.user.id;

			const [itemsRes, deptsRes, usersRes, castingRes] = await Promise.all([
				getShowInventory(showId),
				getDepartments(),
				getShowUsers(showId),
				getShowCasting(showId),
			]);

			setItems(itemsRes.data);
			setDepartments(deptsRes.data);
			setShowMembers(usersRes.data || []);
			setCharacters(castingRes.data?.data || []);

			const myMembership = usersRes.data.find(
				(u) => u.User?.id === currentUserId || u.users_id === currentUserId,
			);
			if (myMembership?.assignedRoles) {
				setUserRoles(
					myMembership.assignedRoles.map((r) => r.name.toLowerCase()),
				);
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
		if (
			userRoles.includes("director") ||
			userRoles.includes("stage-manager") ||
			userRoles.includes("admin")
		)
			return true;
		return userRoles.includes(deptName.toLowerCase());
	};

	const getMemberOptionsForDept = (deptName) => {
		const dept = String(deptName || "").toLowerCase();
		return showMembers.filter((member) => {
			const roles = (member.assignedRoles || []).map((r) =>
				String(r.name || "").toLowerCase(),
			);
			if (roles.includes("director") || roles.includes("stage-manager"))
				return true;
			if (roles.includes(dept)) return true;
			if (dept === "costumes" || dept === "props") {
				return roles.includes("actor");
			}
			return false;
		});
	};

	const getCharacterOptionsForDept = (deptName) => {
		const dept = String(deptName || "").toLowerCase();
		if (dept !== "costumes" && dept !== "props") return [];
		return characters;
	};

	const getAssignmentValue = (item) => {
		if (item.assigned_character_id)
			return `character-${item.assigned_character_id}`;
		if (item.assigned_user_id) return `user-${item.assigned_user_id}`;
		return "";
	};

	const getAssignmentDisplay = (item) => {
		if (item.assignedCharacter?.name) return item.assignedCharacter.name;
		if (item.assignedUser) {
			return `${item.assignedUser.fname || ""} ${item.assignedUser.lname || ""}`.trim();
		}
		return "Unassigned";
	};

	const handleAssignChange = async (item, value) => {
		try {
			setAssigningItemId(item.id);
			if (!value) {
				await assignShowInventoryItem(showId, item.id, {
					users_id: null,
					casting_id: null,
				});
			} else if (value.startsWith("user-")) {
				await assignShowInventoryItem(showId, item.id, {
					users_id: Number(value.replace("user-", "")),
					casting_id: null,
				});
			} else if (value.startsWith("character-")) {
				await assignShowInventoryItem(showId, item.id, {
					users_id: null,
					casting_id: Number(value.replace("character-", "")),
				});
			}
			await fetchData();
		} catch (err) {
			alert(err.response?.data?.message || "Failed to assign inventory item");
		} finally {
			setAssigningItemId(null);
		}
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

	const handleEdit = (item) => {
		setSelectedItem(item);
		setIsEditModalOpen(true);
	};

	const handleEditSave = async (payload) => {
		if (!selectedItem) return;
		await updateShowInventoryItem(showId, selectedItem.id, payload);
		await fetchData();
	};

	const filteredItems = items.filter((item) => {
		const matchesSearch = item.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesDept =
			selectedDept === "All" || item.Department?.name === selectedDept;
		return matchesSearch && matchesDept;
	});

	const hasAnyAddPermission =
		userRoles.includes("director") ||
		userRoles.includes("stage-manager") ||
		userRoles.includes("admin") ||
		departments.some((d) => userRoles.includes(d.name.toLowerCase()));

	if (isLoading) {
		return (
			<div className="flex min-h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">
				Loading Show Inventory...
			</div>
		);
	}

	return (
		<div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<Link
						to={`/orgs/${orgId}/shows/${showId}`}
						className="font-medium text-blue-600 text-sm hover:underline"
					>
						&larr; Back to Show Dashboard
					</Link>
					<h1 className="mt-1 font-bold text-3xl text-gray-900">
						Show Inventory
					</h1>
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

			<EditInventoryItemModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedItem(null);
				}}
				item={selectedItem}
				departments={departments}
				onSave={handleEditSave}
				title="Edit Show Inventory Item"
				submitLabel="Save Changes"
			/>

			<DashboardSection
				title="Items Assigned to this Show"
				actionTitle={hasAnyAddPermission ? "Manage Inventory" : undefined}
				onActionClick={
					hasAnyAddPermission ? () => setIsManageModalOpen(true) : undefined
				}
				className="flex-1"
			>
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

				{filteredItems.length > 0 ? (
					<div className="grid gap-4 xl:grid-cols-2">
						{filteredItems.map((item) => (
							<InventoryItemCard
								key={item.id}
								item={item}
								title={item.name}
								description={item.description}
								badges={
									<>
										<span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-semibold text-blue-700 text-xs">
											{item.Department?.name || "Unknown"}
										</span>
										{item.is_global ? (
											<span className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 font-semibold text-purple-700 text-xs">
												Global Stock
											</span>
										) : (
											<span className="inline-flex items-center rounded-full border border-amber-100 bg-amber-50 px-3 py-1 font-semibold text-amber-700 text-xs">
												Custom Show Item
											</span>
										)}
									</>
								}
								footer={
									<div className="w-full space-y-2">
										<div className="font-semibold text-gray-400 text-xs uppercase tracking-wide">
											Assigned To
										</div>
										{canManageDept(item.Department?.name) ? (
											<select
												value={getAssignmentValue(item)}
												onChange={(e) =>
													handleAssignChange(item, e.target.value)
												}
												disabled={assigningItemId === item.id}
												className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
											>
												<option value="">Unassigned</option>
												{getMemberOptionsForDept(item.Department?.name).length >
													0 && (
													<optgroup label="People">
														{getMemberOptionsForDept(item.Department?.name).map(
															(member) => {
																const userId =
																	member.User?.id ?? member.users_id;
																const label =
																	`${member.User?.fname || ""} ${member.User?.lname || ""}`.trim();
																return (
																	<option
																		key={`user-${userId}`}
																		value={`user-${userId}`}
																	>
																		{label}
																	</option>
																);
															},
														)}
													</optgroup>
												)}
												{getCharacterOptionsForDept(item.Department?.name)
													.length > 0 && (
													<optgroup label="Characters">
														{getCharacterOptionsForDept(
															item.Department?.name,
														).map((character) => (
															<option
																key={`character-${character.id}`}
																value={`character-${character.id}`}
															>
																{character.name}
															</option>
														))}
													</optgroup>
												)}
											</select>
										) : (
											<p className="text-gray-700 text-sm">
												{getAssignmentDisplay(item)}
											</p>
										)}
									</div>
								}
								actions={
									canManageDept(item.Department?.name) ? (
										<>
											<button
												type="button"
												onClick={() => handleEdit(item)}
												className="font-medium text-blue-600 transition-colors hover:text-blue-800"
											>
												Edit
											</button>
											<button
												type="button"
												onClick={() =>
													handleRemove(item.id, item.name, item.is_global)
												}
												className="font-medium text-red-600 transition-colors hover:text-red-800"
											>
												Remove
											</button>
										</>
									) : (
										<span className="text-gray-400 text-xs italic">
											View Only
										</span>
									)
								}
							/>
						))}
					</div>
				) : (
					<div className="rounded-xl border border-gray-300 border-dashed bg-white px-6 py-10 text-center text-gray-500 italic shadow-sm">
						No inventory items assigned to this show.
					</div>
				)}
			</DashboardSection>
		</div>
	);
}
