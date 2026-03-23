import { useState, useEffect } from "react";
import { createShowEvent, getShowUsers, assignShowEventUsers } from "../services/api";
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
    ModalHeader, ModalNav, ModalNavItem, ModalBody, ModalBox, ModalCheckboxItem
} from "./ui/modals";

export default function CreateEventModal({ isOpen, onClose, showId, onSuccess }) {
    const [activeTab, setActiveTab] = useState("details");
    const [formData, setFormData] = useState({ title: "", date: "", start_time: "", end_time: "", location: "", description: "" });
    const [showMembers, setShowMembers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setActiveTab("details");
            setFormData({ title: "", date: "", start_time: "", end_time: "", location: "", description: "" });
            setSelectedUserIds([]);
            setError("");

            getShowUsers(showId).then(res => {
                setShowMembers(res.data);
                const roles = new Set();
                res.data.forEach(m => m.assignedRoles?.forEach(r => roles.add(r.name)));
                setAvailableRoles(Array.from(roles));
            }).catch(() => {
                setError("Failed to load show members");
            });
        }
    }, [isOpen, showId]);

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
                await assignShowEventUsers(showId, res.data.data.id, {
                    type: "specific",
                    userIds: selectedUserIds
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
                        Assignments ({selectedUserIds.length})
                    </ModalNavItem>
                </ModalNav>

                {error && <ModalError>{error}</ModalError>}

                <ModalBody>
                    {activeTab === "details" && (
                        <div className="space-y-4">
                            <div>
                                <ModalLabel htmlFor="create-event-title">Event Title</ModalLabel>
                                <ModalInput
                                    id="create-event-title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
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
                            </div>

                            <div>
                                <ModalLabel htmlFor="create-event-location">Location</ModalLabel>
                                <ModalInput
                                    id="create-event-location"
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <ModalLabel htmlFor="create-event-description">Notes / Description</ModalLabel>
                                <ModalTextarea
                                    id="create-event-description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional notes..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "assignments" && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>

                            {availableRoles.length > 0 && (
                            <ModalSubsection>
                                <ModalSubHeader>Assign by Role</ModalSubHeader>
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
                                                <div className="text-sm font-medium capitalize">{member.User?.fname} {member.User?.lname}</div>
                                                <div className="text-xs text-gray-500">
                                                    {member.assignedRoles?.map(r => r.name).join(', ')}
                                                </div>
                                            </div>
                                        </ModalLabel>
                                    ))}
                                </ModalBox>
                            </ModalSubsection>
                        </div>
                    )}
                </ModalBody>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                    <ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
                    <ModalSubmitButton type="button" onClick={handleCreateEvent} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Event"}
                    </ModalSubmitButton>
                </div>
            </ModalSubWrapper>
        </ModalWrapper>
    );
}
