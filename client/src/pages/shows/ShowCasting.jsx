import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	assignShowCharacter,
	createShowCharacter,
	deleteShowCharacter,
	getShowCasting,
	getShowUsers,
	updateShowCharacter,
	verifyToken,
} from "../../services/api.js";
import DashboardSection from "../../components/ui/DashboardSection.jsx";

export default function ShowCasting() {
	const { orgId, showId } = useParams();
	const [characters, setCharacters] = useState([]);
	const [members, setMembers] = useState([]);
	const [currentUserRoles, setCurrentUserRoles] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [newName, setNewName] = useState("");
	const [newAssignedUserId, setNewAssignedUserId] = useState("");

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			setError("");
			const authRes = await verifyToken();
			const me = authRes.data.user.id;

			const [castingRes, usersRes] = await Promise.all([
				getShowCasting(showId),
				getShowUsers(showId),
			]);

			setCharacters(castingRes.data.data || []);
			setMembers(usersRes.data || []);

			const myMembership = (usersRes.data || []).find(
				(u) => u.User?.id === me || u.users_id === me,
			);
			const roles = (myMembership?.assignedRoles || []).map((r) =>
				r.name.toLowerCase(),
			);
			setCurrentUserRoles(roles);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load casting data");
		} finally {
			setIsLoading(false);
		}
	}, [showId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const canManage = useMemo(
		() =>
			currentUserRoles.includes("director") ||
			currentUserRoles.includes("stage-manager"),
		[currentUserRoles],
	);

	const memberOptions = useMemo(
		() =>
			members
				.filter((m) =>
					(m.assignedRoles || []).some(
						(role) => role.name?.toLowerCase() === "actor",
					),
				)
				.map((m) => ({
					id: m.User?.id ?? m.users_id,
					name: `${m.User?.fname || ""} ${m.User?.lname || ""}`.trim(),
				}))
				.filter((m) => m.id),
		[members],
	);

	const displayNameForUser = (user) => {
		if (!user) return "Unassigned";
		return `${user.fname || ""} ${user.lname || ""}`.trim() || user.email || "Assigned";
	};

	const handleCreate = async () => {
		if (!newName.trim()) {
			setError("Character name is required");
			return;
		}
		setError("");
		await createShowCharacter(showId, {
			name: newName.trim(),
			users_id: newAssignedUserId ? Number(newAssignedUserId) : null,
		});
		setNewName("");
		setNewAssignedUserId("");
		await fetchData();
	};

	const handleRename = async (character) => {
		const nextName = window.prompt("Character name", character.name);
		if (nextName == null) return;
		if (!nextName.trim()) {
			setError("Character name is required");
			return;
		}
		setError("");
		await updateShowCharacter(showId, character.id, { name: nextName.trim() });
		await fetchData();
	};

	const handleAssign = async (characterId, value) => {
		setError("");
		await assignShowCharacter(
			showId,
			characterId,
			value ? Number(value) : null,
		);
		await fetchData();
	};

	const handleDelete = async (character) => {
		if (!window.confirm(`Delete character "${character.name}"?`)) return;
		setError("");
		await deleteShowCharacter(showId, character.id);
		await fetchData();
	};

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">
				Loading Casting...
			</div>
		);
	}

	return (
		<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
			<div className="mb-6">
				<Link
					to={`/orgs/${orgId}/shows/${showId}`}
					className="text-sm font-medium text-blue-600 hover:underline"
				>
					&larr; Back to Show Dashboard
				</Link>
				<h1 className="mt-1 text-3xl font-bold text-gray-900">Casting</h1>
			</div>

			<DashboardSection title="Characters" className="flex-1">
				{error && (
					<div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
						{error}
					</div>
				)}

				{canManage && (
					<div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 md:grid-cols-[1fr_260px_auto]">
						<input
							type="text"
							placeholder="Character name"
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
						<select
							value={newAssignedUserId}
							onChange={(e) => setNewAssignedUserId(e.target.value)}
							className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						>
							<option value="">Unassigned</option>
							{memberOptions.map((m) => (
								<option key={m.id} value={m.id}>
									{m.name}
								</option>
							))}
						</select>
						<button
							type="button"
							onClick={handleCreate}
							className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
						>
							Add Character
						</button>
					</div>
				)}

				<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
					<table className="w-full text-left text-sm text-gray-700">
						<thead className="bg-gray-50 text-gray-700">
							<tr>
								<th className="px-4 py-3 font-semibold">Character</th>
								<th className="px-4 py-3 font-semibold">Assigned Member</th>
								<th className="px-4 py-3 font-semibold text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{characters.length > 0 ? (
								characters.map((character) => (
									<tr key={character.id} className="hover:bg-gray-50">
										<td className="px-4 py-3 font-medium text-gray-900">{character.name}</td>
										<td className="px-4 py-3">
											{canManage ? (
												<select
													value={character.users_id ?? ""}
													onChange={(e) =>
														handleAssign(character.id, e.target.value)
													}
													className="rounded border border-gray-300 px-2 py-1"
												>
													<option value="">Unassigned</option>
													{memberOptions.map((m) => (
														<option key={m.id} value={m.id}>
															{m.name}
														</option>
													))}
												</select>
											) : (
												displayNameForUser(character.User)
											)}
										</td>
										<td className="px-4 py-3 text-right">
											{canManage ? (
												<div className="flex items-center justify-end gap-3">
													<button
														type="button"
														onClick={() => handleRename(character)}
														className="font-medium text-blue-600 hover:text-blue-800"
													>
														Rename
													</button>
													<button
														type="button"
														onClick={() => handleDelete(character)}
														className="font-medium text-red-600 hover:text-red-800"
													>
														Delete
													</button>
												</div>
											) : (
												<span className="text-gray-400 italic text-xs">View Only</span>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="3" className="px-4 py-8 text-center italic text-gray-500">
										No characters created yet.
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


