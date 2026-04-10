import { useEffect, useState } from "react";
import { assignOrgEventUsers, createOrgEvent, getOrganizationUsers } from "../../../services/api.js";
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
    ModalFooter,
    ModalInputContainer,
    ModalInputParent,
    ModalBox,
    ModalCheckboxItem,
} from "../../ui/modals/index.js";

export default function CreateOrgEventModal({ isOpen, onClose, orgId, onSuccess, initialDate = "" }) {
    const [activeTab, setActiveTab] = useState("details");
    const [formData, setFormData] = useState({ title: "", date: "", start_time: "", end_time: "", location: "", description: "" });
    const [orgMembers, setOrgMembers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setActiveTab("details");
          setFormData({ title: "", date: initialDate || "", start_time: "", end_time: "", location: "", description: "" });
            setSelectedUserIds([]);
            setError("");

            getOrganizationUsers(orgId).then((res) => {
                setOrgMembers(res.data);
                const roles = new Set();
                res.data.forEach((member) => member.assignedRoles?.forEach((role) => roles.add(role.name)));
                setAvailableRoles(Array.from(roles));
            }).catch(() => {
                setError("Failed to load organizations members");
            });
        }
      }, [isOpen, orgId, initialDate]);

    const isRoleFullySelected = (role) => {
        const usersWithRole = orgMembers.filter((member) =>
            member.assignedRoles?.some((assignedRole) => assignedRole.name === role)
        );

        return usersWithRole.length > 0 && usersWithRole.every((member) => selectedUserIds.includes(member.users_id));
    };

    const toggleRole = (role) => {
        const usersWithRole = orgMembers
            .filter((member) => member.assignedRoles?.some((assignedRole) => assignedRole.name === role))
            .map((member) => member.users_id);

        if (isRoleFullySelected(role)) {
            setSelectedUserIds((prev) => prev.filter((id) => !usersWithRole.includes(id)));
            return;
        }

        setSelectedUserIds((prev) => Array.from(new Set([...prev, ...usersWithRole])));
    };

    const toggleUser = (userId) => {
        setSelectedUserIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
    };

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
            const res = await createOrgEvent(orgId, payload);

            if (selectedUserIds.length > 0) {
                await assignOrgEventUsers(orgId, res.data.data.id, {
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
                        <ModalInputParent>
                            <ModalInputContainer>
                                <ModalLabel htmlFor="create-org-event-title">Event Title</ModalLabel>
                                <ModalInput id="create-org-event-title" type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </ModalInputContainer>

                            <ModalInputContainer columns={3}>
                                <div>
                                    <ModalLabel htmlFor="create-org-event-date">Date</ModalLabel>
                                    <ModalInput id="create-org-event-date" type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div>
                                    <ModalLabel htmlFor="create-org-event-start-time">Start Time</ModalLabel>
                                    <ModalInput id="create-org-event-start-time" type="time" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} />
                                </div>
                                <div>
                                    <ModalLabel htmlFor="create-org-event-end-time">End Time</ModalLabel>
                                    <ModalInput id="create-org-event-end-time" type="time" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} />
                                </div>
                            </ModalInputContainer>

                            <ModalInputContainer>
                                <ModalLabel htmlFor="create-org-event-location">Location</ModalLabel>
                                <ModalInput id="create-org-event-location" type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Optional" />
                            </ModalInputContainer>

                            <ModalInputContainer>
                                <ModalLabel htmlFor="create-org-event-description">Notes / Description</ModalLabel>
                                <ModalTextarea id="create-org-event-description" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Optional notes..." />
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
                                    {availableRoles.map((role) => (
                                        <ModalCheckboxItem key={role} role={role} isSelected={isRoleFullySelected(role)} onToggle={() => toggleRole(role)} />
                                    ))}
                                </ModalBox>
                            </ModalSubsection>
                            )}

                            <ModalSubsection>
                                <ModalSubHeader>Assign Specific Individuals</ModalSubHeader>
                                <ModalBox>
                                    {orgMembers.map((member) => (
                                        <ModalLabel key={member.users_id} variant="checkbox">
                                            <ModalCheckbox checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} />
                                            <div>
                                                <div className="text-sm font-medium">{member.User?.fname} {member.User?.lname}</div>
                                                <div className="text-xs text-gray-500">{member.assignedRoles?.map((role) => role.name).join(", ")}</div>
                                            </div>
                                        </ModalLabel>
                                    ))}
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