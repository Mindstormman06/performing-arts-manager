import { useEffect, useState } from "react";
import { assignOrgEventUsers, createOrgEvent, getOrganizationUsers } from "../services/api";
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
} from "./ui/modals";

export default function CreateOrgEventModal({ isOpen, onClose, orgId, onSuccess }) {
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
            setFormData({ title: "", date: "", start_time: "", end_time: "", location: "", description: "" });
            setSelectedUserIds([]);
            setError("");

            getOrganizationUsers(orgId).then((res) => {
                setOrgMembers(res.data);
                const roles = new Set();
                res.data.forEach((member) => member.assignedRoles?.forEach((role) => roles.add(role.name)));
                setAvailableRoles(Array.from(roles));
            }).catch(() => {
                setError("Failed to load organization members");
            });
        }
    }, [isOpen, orgId]);

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
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Create Event</h2>
                    <button onClick={onClose} className="text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>
                </div>

                <div className="mb-4 flex border-b border-gray-200">
                    <button
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "details" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("details")}
                    >
                        Event Details
                    </button>
                    <button
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "assignments" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("assignments")}
                    >
                        Assignments ({selectedUserIds.length})
                    </button>
                </div>

                {error && <ModalError>{error}</ModalError>}

                <div className="flex-1 overflow-y-auto">
                    {activeTab === "details" && (
                        <div className="space-y-4">
                            <div>
                                <ModalLabel htmlFor="create-org-event-title">Event Title</ModalLabel>
                                <ModalInput id="create-org-event-title" type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                            </div>

                            <div>
                                <ModalLabel htmlFor="create-org-event-location">Location</ModalLabel>
                                <ModalInput id="create-org-event-location" type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Optional" />
                            </div>

                            <div>
                                <ModalLabel htmlFor="create-org-event-description">Notes / Description</ModalLabel>
                                <ModalTextarea id="create-org-event-description" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Optional notes..." />
                            </div>
                        </div>
                    )}

                    {activeTab === "assignments" && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>

                            {availableRoles.length > 0 && (
                            <ModalSubsection>
                                <ModalSubHeader>Assign by Role</ModalSubHeader>
                                    <div className="flex flex-wrap gap-3">
                                        {availableRoles.map((role) => (
                                            <label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">
                                                <ModalCheckbox checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} />
                                                <span className="text-sm font-medium capitalize">{role}</span>
                                            </label>
                                        ))}
                                    </div>
                                </ModalSubsection>
                            )}

                            <ModalSubsection>
                                <ModalSubHeader>Assign Specific Individuals</ModalSubHeader>
                                <div className="grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
                                    {orgMembers.map((member) => (
                                        <label key={member.users_id} className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-blue-50">
                                            <ModalCheckbox checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} />
                                            <div>
                                                <div className="text-sm font-medium">{member.User?.fname} {member.User?.lname}</div>
                                                <div className="text-xs text-gray-500">{member.assignedRoles?.map((role) => role.name).join(", ")}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </ModalSubsection>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                    <ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
                    <ModalSubmitButton type="button" onClick={handleCreateEvent} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Event"}
                    </ModalSubmitButton>
                </div>
            </div>
        </ModalWrapper>
    );
}