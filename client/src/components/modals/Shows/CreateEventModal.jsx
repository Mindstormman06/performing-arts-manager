import { useState, useEffect } from "react";
import {
    createShowEvent,
    getShowUsers,
    getShowCasting,
    assignShowEventUsers,
} from "../../../services/api.js";
import {
    ModalCancelButton,
    ModalCheckbox,
    ModalError,
    ModalInput,
    ModalLabel,
    ModalSubHeader,
    ModalSubsection,
    ModalSubmitButton,
    ModalTextarea,
    ModalWrapper,
    ModalSubWrapper,
    ModalHeader,
    ModalNav,
    ModalNavItem,
    ModalBody,
    ModalBox,
    ModalCheckboxItem,
    ModalFooter,
    ModalInputContainer,
    ModalInputParent
} from "../../ui/modals/index.js";

export default function CreateEventModal({ isOpen, onClose, showId, onSuccess, initialDate = "" }) {
    const [activeTab, setActiveTab] = useState("details");
    const [formData, setFormData] = useState({ title: "", date: "", start_time: "", end_time: "", location: "", description: "" });
    const [showMembers, setShowMembers] = useState([]);
    const [unassignedCharacters, setUnassignedCharacters] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectedCharacterIds, setSelectedCharacterIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const getMemberDisplayName = (member) => {
        const baseName = `${member.User?.fname || ""} ${member.User?.lname || ""}`.trim();
        const characterName = member.characterName;
        return characterName ? `${baseName} - ${characterName}` : baseName;
    };

    const getValidUserIds = (ids) =>
        ids
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0);

    useEffect(() => {
        if (isOpen) {
            setActiveTab("details");
          setFormData({ title: "", date: initialDate || "", start_time: "", end_time: "", location: "", description: "" });
            setSelectedUserIds([]);
            setSelectedCharacterIds([]);
            setError("");

            Promise.all([getShowUsers(showId), getShowCasting(showId)]).then(([usersRes, castingRes]) => {
                const charactersByUser = new Map();
                (castingRes.data?.data || []).forEach((character) => {
                    if (!character.users_id) return;
                    if (!charactersByUser.has(character.users_id)) {
                        charactersByUser.set(character.users_id, []);
                    }
                    charactersByUser.get(character.users_id).push(character.name);
                });

                const membersWithCharacterLabels = usersRes.data.map((member) => {
                    const characterNames = charactersByUser.get(member.users_id) || [];
                    return {
                        ...member,
                        characterName: characterNames[0] || null,
                    };
                });

                const uncastCharacters = (castingRes.data?.data || [])
                    .filter((character) => !character.users_id)
                    .map((character) => ({ id: character.id, name: character.name }));

                setShowMembers(membersWithCharacterLabels);
                setUnassignedCharacters(uncastCharacters);
                const roles = new Set();
                usersRes.data.forEach(m => m.assignedRoles?.forEach(r => roles.add(r.name)));
                setAvailableRoles(Array.from(roles));
            }).catch(() => {
                setError("Failed to load show members");
            });
        }
      }, [isOpen, showId, initialDate]);

    const handleCreateEvent = async () => {
        if (!formData.title || !formData.date || !formData.start_time || !formData.end_time) {
            setError("Complete the required event details before creating the event.");
            setActiveTab("details");
            return;
        }

        const startDateTime = new Date(`${formData.date}T${formData.start_time}`);
        const endDateTime = new Date(`${formData.date}T${formData.end_time}`);

        if (endDateTime <= startDateTime) {
            setError("End time must be after start time.");
            setActiveTab("details");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const payload = {
                ...formData,
                start_time: `${formData.date}T${formData.start_time}`,
                end_time: `${formData.date}T${formData.end_time}`
            };
            const res = await createShowEvent(showId, payload);

            if (selectedUserIds.length > 0) {
                const validUserIds = getValidUserIds(selectedUserIds);
                await assignShowEventUsers(showId, res.data.data.id, {
                    type: "specific",
                    userIds: validUserIds,
                    characterIds: selectedCharacterIds,
                });
            } else if (selectedCharacterIds.length > 0) {
                await assignShowEventUsers(showId, res.data.data.id, {
                    type: "specific",
                    userIds: [],
                    characterIds: selectedCharacterIds,
                });
            }

            onSuccess();
            onClose();
        } catch {
            setError("Failed to create event");
        } finally {
            setIsLoading(false);
        }
    };

    const isRoleFullySelected = (role) => {
        const usersWithRole = showMembers.filter(member =>
            member.assignedRoles?.some(assignedRole => assignedRole.name === role)
        );

        return usersWithRole.length > 0 && usersWithRole.every(member => selectedUserIds.includes(member.users_id));
    };

    const toggleRole = (role) => {
        const usersWithRole = showMembers
            .filter(member => member.assignedRoles?.some(assignedRole => assignedRole.name === role))
            .map(member => member.users_id);

        if (isRoleFullySelected(role)) {
            setSelectedUserIds(prev => prev.filter(id => !usersWithRole.includes(id)));
            return;
        }

        setSelectedUserIds(prev => Array.from(new Set([...prev, ...usersWithRole])));
    };

    const toggleUser = (userId) => {
        setSelectedUserIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const toggleCharacter = (characterId) => {
        setSelectedCharacterIds((prev) =>
            prev.includes(characterId)
                ? prev.filter((id) => id !== characterId)
                : [...prev, characterId],
        );
    };

    if (!isOpen) return null;

    return (
        <ModalWrapper>
            <ModalSubWrapper>
                <ModalHeader onClick={onClose}>Create Event</ModalHeader>

                <ModalNav>
                    <ModalNavItem isActive={activeTab === "details"} onClick={() => setActiveTab("details")}>
                        Event Details
                    </ModalNavItem>
                    <ModalNavItem isActive={activeTab === "assignments"} onClick={() => setActiveTab("assignments")}>
                        Assignments ({selectedUserIds.length + selectedCharacterIds.length})
                    </ModalNavItem>
                </ModalNav>

                {error && <ModalError>{error}</ModalError>}

                <ModalBody>
                    {activeTab === "details" && (
                        <ModalInputParent>
                            <ModalInputContainer>
                                <ModalLabel htmlFor="create-event-title">Event Title</ModalLabel>
                                <ModalInput
                                    id="create-event-title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </ModalInputContainer>

                            <ModalInputContainer columns={3}>
                                <div>
                                    <ModalLabel htmlFor="create-event-date">Date</ModalLabel>
                                    <ModalInput
                                        id="create-event-date"
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <ModalLabel htmlFor="create-event-start-time">Start Time</ModalLabel>
                                    <ModalInput
                                        id="create-event-start-time"
                                        type="time"
                                        required
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <ModalLabel htmlFor="create-event-end-time">End Time</ModalLabel>
                                    <ModalInput
                                        id="create-event-end-time"
                                        type="time"
                                        required
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    />
                                </div>
                            </ModalInputContainer>

                            <ModalInputContainer>
                                <ModalLabel htmlFor="create-event-location">Location</ModalLabel>
                                <ModalInput
                                    id="create-event-location"
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Optional"
                                />
                            </ModalInputContainer>

                            <ModalInputContainer>
                                <ModalLabel htmlFor="create-event-description">Notes / Description</ModalLabel>
                                <ModalTextarea
                                    id="create-event-description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional notes..."
                                />
                            </ModalInputContainer>
                        </ModalInputParent>
                    )}

                    {activeTab === "assignments" && (
                        <ModalInputParent>
                            <p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>

                            {availableRoles.length > 0 && (
                            <ModalSubsection>
                                <ModalSubHeader>Quick Select</ModalSubHeader>
                                    <ModalBox>
                                        {availableRoles.map(role => (
                                            <ModalCheckboxItem key={role} role={role} isSelected={isRoleFullySelected(role)} onToggle={() => toggleRole(role)} />
                                        ))}
                                    </ModalBox>
                                </ModalSubsection>
                            )}

                            <ModalSubsection>
                                <ModalSubHeader>Assign Specific Individuals</ModalSubHeader>
                                <ModalBox>
                                    {showMembers.map(member => (
                                        <ModalLabel key={member.users_id} variant="checkbox">
                                            <ModalCheckbox checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} />
                                            <div>
                                                <div className="text-sm font-medium capitalize">{getMemberDisplayName(member)}</div>
                                                <div className="text-xs text-gray-500">
                                                    {member.assignedRoles?.map(r => r.name).join(', ')}
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
                                            <ModalLabel key={character.id} variant="checkbox">
                                                <ModalCheckbox
                                                    checked={selectedCharacterIds.includes(character.id)}
                                                    onChange={() => toggleCharacter(character.id)}
                                                />
                                                <div>
                                                    <div className="text-sm font-medium">{character.name}</div>
                                                    <div className="text-xs text-gray-500">Uncast character</div>
                                                </div>
                                            </ModalLabel>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No uncast characters available.</p>
                                    )}
                                </ModalBox>
                            </ModalSubsection>
                        </ModalInputParent>
                    )}
                </ModalBody>

                <ModalFooter>
                    <ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
                    <ModalSubmitButton type="button" onClick={handleCreateEvent} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Event"}
                    </ModalSubmitButton>
                </ModalFooter>
            </ModalSubWrapper>
        </ModalWrapper>
    );
}
