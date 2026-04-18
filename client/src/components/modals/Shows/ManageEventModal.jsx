import { useEffect, useState } from "react";
import {
	assignShowEventUsers,
	deleteShowEvent,
	getShowCasting,
	getShowUsers,
	updateShowEvent,
} from "../../../services/api.js";
import {
	localDateTimeToUtcIso,
	utcToLocalDateTimeInput,
} from "../../../utils/dateTime.js";
import {
	ModalBody,
	ModalBox,
	ModalCancelButton,
	ModalCheckbox,
	ModalCheckboxItem,
	ModalError,
	ModalFooter,
	ModalHeader,
	ModalInput,
	ModalInputContainer,
	ModalInputParent,
	ModalLabel,
	ModalNav,
	ModalNavItem,
	ModalSubHeader,
	ModalSubmitButton,
	ModalSubsection,
	ModalSubWrapper,
	ModalTextarea,
	ModalWrapper,
} from "../../ui/modals/index.js";

export default function ManageEventModal({
	isOpen,
	onClose,
	showId,
	event,
	onSuccess,
}) {
	const [activeTab, setActiveTab] = useState("details");
	const [formData, setFormData] = useState({
		title: "",
		start_time: "",
		end_time: "",
		location: "",
		description: "",
	});
	const [showMembers, setShowMembers] = useState([]);
	const [unassignedCharacters, setUnassignedCharacters] = useState([]);
	const [availableRoles, setAvailableRoles] = useState([]);
	const [selectedUserIds, setSelectedUserIds] = useState([]);
	const [selectedCharacterIds, setSelectedCharacterIds] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const getMemberDisplayName = (member) => {
		const baseName =
			`${member.User?.fname || ""} ${member.User?.lname || ""}`.trim();
		const characterName = member.characterName;
		return characterName ? `${baseName} - ${characterName}` : baseName;
	};

	const getValidUserIds = (ids) =>
		ids.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0);

	useEffect(() => {
		if (isOpen && event) {
			setActiveTab("details");
			setError("");

			setFormData({
				title: event.title || "",
				start_time: utcToLocalDateTimeInput(event.start_time),
				end_time: utcToLocalDateTimeInput(event.end_time),
				location: event.location || "",
				description: event.description || "",
			});

			const currentAssignees = (event.attendees || event.Users || []).map(
				(user) => user.id,
			);
			setSelectedUserIds(currentAssignees);
			setSelectedCharacterIds(
				(event.requiredCharacters || []).map((c) => c.id),
			);

			Promise.all([getShowUsers(showId), getShowCasting(showId)])
				.then(([usersRes, castingRes]) => {
					const charactersByUser = new Map();
					(castingRes.data?.data || []).forEach((character) => {
						if (!character.users_id) return;
						if (!charactersByUser.has(character.users_id)) {
							charactersByUser.set(character.users_id, []);
						}
						charactersByUser.get(character.users_id).push(character.name);
					});

					const members = usersRes.data.map((member) => {
						const characterNames = charactersByUser.get(member.users_id) || [];
						return {
							...member,
							characterName: characterNames[0] || null,
						};
					});

					const uncastCharacters = (castingRes.data?.data || [])
						.filter((character) => !character.users_id)
						.map((character) => ({ id: character.id, name: character.name }));

					setShowMembers(members);
					setUnassignedCharacters(uncastCharacters);

					const roles = new Set();
					members.forEach((m) => {
						if (m.assignedRoles) {
							m.assignedRoles.forEach((r) => {
								roles.add(r.name);
							});
						}
					});
					setAvailableRoles(Array.from(roles));
				})
				.catch(() => {
					setError("Failed to load show members");
				});
		}
	}, [isOpen, event, showId]);

	if (!isOpen || !event) return null;

	const handleSaveEvent = async () => {
		if (!formData.title || !formData.start_time || !formData.end_time) {
			setError("Complete the required event details before saving the event.");
			setActiveTab("details");
			return;
		}

		if (new Date(formData.end_time) <= new Date(formData.start_time)) {
			setError("End time must be after start time.");
			setActiveTab("details");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await updateShowEvent(showId, event.id, {
				...formData,
				start_time: localDateTimeToUtcIso(formData.start_time),
				end_time: localDateTimeToUtcIso(formData.end_time),
			});

			// Always persist assignments so removals (empty array) are saved too.
			await assignShowEventUsers(showId, event.id, {
				type: "specific",
				userIds: getValidUserIds(selectedUserIds),
				characterIds: selectedCharacterIds,
			});

			onSuccess();
			onClose();
		} catch {
			setError("Failed to save event changes");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (
			window.confirm(
				"Are you sure you want to delete this event? This will remove it from the organizations calendar as well.",
			)
		) {
			try {
				await deleteShowEvent(showId, event.id);
				onSuccess();
				onClose();
			} catch {
				setError("Failed to delete event");
			}
		}
	};

	const isRoleFullySelected = (role) => {
		const usersWithRole = showMembers.filter((member) =>
			member.assignedRoles?.some((assignedRole) => assignedRole.name === role),
		);

		return (
			usersWithRole.length > 0 &&
			usersWithRole.every((member) => selectedUserIds.includes(member.users_id))
		);
	};

	const toggleRole = (role) => {
		const usersWithRole = showMembers
			.filter((member) =>
				member.assignedRoles?.some(
					(assignedRole) => assignedRole.name === role,
				),
			)
			.map((member) => member.users_id);

		if (isRoleFullySelected(role)) {
			setSelectedUserIds((prev) =>
				prev.filter((id) => !usersWithRole.includes(id)),
			);
			return;
		}

		setSelectedUserIds((prev) =>
			Array.from(new Set([...prev, ...usersWithRole])),
		);
	};

	const toggleUser = (userId) => {
		setSelectedUserIds((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	};

	const toggleCharacter = (characterId) => {
		setSelectedCharacterIds((prev) =>
			prev.includes(characterId)
				? prev.filter((id) => id !== characterId)
				: [...prev, characterId],
		);
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Manage Event</ModalHeader>

				<ModalNav>
					<ModalNavItem
						isActive={activeTab === "details"}
						onClick={() => setActiveTab("details")}
					>
						Event Details
					</ModalNavItem>
					<ModalNavItem
						isActive={activeTab === "assignments"}
						onClick={() => setActiveTab("assignments")}
					>
						Assignments ({selectedUserIds.length + selectedCharacterIds.length})
					</ModalNavItem>
				</ModalNav>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					{activeTab === "details" && (
						<ModalInputParent>
							<ModalInputContainer>
								<ModalLabel htmlFor="manage-event-title">
									Event Title
								</ModalLabel>
								<ModalInput
									id="manage-event-title"
									type="text"
									required
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
								/>
							</ModalInputContainer>

							<ModalInputContainer columns={2}>
								<div>
									<ModalLabel htmlFor="manage-event-start-time">
										Start Time
									</ModalLabel>
									<ModalInput
										id="manage-event-start-time"
										type="datetime-local"
										required
										value={formData.start_time}
										onChange={(e) =>
											setFormData({ ...formData, start_time: e.target.value })
										}
									/>
								</div>
								<div>
									<ModalLabel htmlFor="manage-event-end-time">
										End Time
									</ModalLabel>
									<ModalInput
										id="manage-event-end-time"
										type="datetime-local"
										required
										value={formData.end_time}
										onChange={(e) =>
											setFormData({ ...formData, end_time: e.target.value })
										}
									/>
								</div>
							</ModalInputContainer>

							<ModalInputContainer>
								<ModalLabel htmlFor="manage-event-location">
									Location
								</ModalLabel>
								<ModalInput
									id="manage-event-location"
									type="text"
									value={formData.location}
									onChange={(e) =>
										setFormData({ ...formData, location: e.target.value })
									}
									placeholder="Optional"
								/>
							</ModalInputContainer>

							<ModalInputContainer>
								<ModalLabel htmlFor="manage-event-description">
									Notes / Description
								</ModalLabel>
								<ModalTextarea
									id="manage-event-description"
									rows="3"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									placeholder="Optional notes..."
								/>
							</ModalInputContainer>
						</ModalInputParent>
					)}

					{activeTab === "assignments" && (
						<ModalInputParent>
							<p className="text-gray-600 text-sm">
								Select roles or specific individuals who are required to attend
								this event.
							</p>

							{availableRoles.length > 0 && (
								<ModalSubsection>
									<ModalSubHeader>Quick Select</ModalSubHeader>
									<ModalBox>
										{availableRoles.map((role) => (
											<ModalCheckboxItem
												key={role}
												role={role}
												isSelected={isRoleFullySelected(role)}
												onToggle={() => toggleRole(role)}
											/>
										))}
									</ModalBox>
								</ModalSubsection>
							)}

							<ModalSubsection>
								<ModalSubHeader>Assign Specific Individuals</ModalSubHeader>
								<ModalBox>
									{showMembers.map((member) => (
										<ModalLabel
											key={member.users_id}
											variant="checkbox"
											htmlFor={`show-event-member-${member.users_id}`}
										>
											<ModalCheckbox
												id={`show-event-member-${member.users_id}`}
												checked={selectedUserIds.includes(member.users_id)}
												onChange={() => toggleUser(member.users_id)}
											/>
											<div>
												<div className="font-medium text-sm">
													{getMemberDisplayName(member)}
												</div>
												<div className="text-gray-500 text-xs">
													{member.assignedRoles?.map((r) => r.name).join(", ")}
												</div>
											</div>
										</ModalLabel>
									))}
								</ModalBox>
							</ModalSubsection>

							<ModalSubsection>
								<ModalSubHeader>Assign Uncast Characters</ModalSubHeader>
								<ModalBox>
									{unassignedCharacters.length > 0 ? (
										unassignedCharacters.map((character) => (
											<ModalLabel
												key={character.id}
												variant="checkbox"
												htmlFor={`show-event-character-${character.id}`}
											>
												<ModalCheckbox
													id={`show-event-character-${character.id}`}
													checked={selectedCharacterIds.includes(character.id)}
													onChange={() => toggleCharacter(character.id)}
												/>
												<div>
													<div className="font-medium text-sm">
														{character.name}
													</div>
													<div className="text-gray-500 text-xs">
														Uncast character
													</div>
												</div>
											</ModalLabel>
										))
									) : (
										<p className="text-gray-500 text-sm italic">
											No uncast characters available.
										</p>
									)}
								</ModalBox>
							</ModalSubsection>
						</ModalInputParent>
					)}
				</ModalBody>

				<ModalFooter>
					<button
						type="button"
						onClick={handleDelete}
						className="mr-auto font-medium text-red-600 text-sm transition-colors hover:text-red-800"
					>
						Delete Event
					</button>
					<ModalCancelButton onClick={onClose}>Done</ModalCancelButton>
					<ModalSubmitButton
						type="button"
						onClick={handleSaveEvent}
						disabled={isLoading}
					>
						{isLoading ? "Saving..." : "Save Event"}
					</ModalSubmitButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
