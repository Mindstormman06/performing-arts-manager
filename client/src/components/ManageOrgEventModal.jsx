import { useEffect, useState } from "react";
import { assignOrgEventUsers, deleteOrgEvent, getOrganizationUsers, updateOrgEvent } from "../services/api";

export default function ManageOrgEventModal({ isOpen, onClose, orgId, event, onSuccess }) {
    const [activeTab, setActiveTab] = useState("details");
    const [formData, setFormData] = useState({ title: "", start_time: "", end_time: "", location: "", description: "" });
    const [orgMembers, setOrgMembers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && event) {
            const formatForInput = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                return date.toISOString().slice(0, 16);
            };

            setFormData({
                title: event.title || "",
                start_time: formatForInput(event.start_time),
                end_time: formatForInput(event.end_time),
                location: event.location || "",
                description: event.description || ""
            });
            setSelectedUserIds((event.attendees || event.Users || []).map((user) => user.id));

            getOrganizationUsers(orgId).then((res) => {
                const members = res.data;
                setOrgMembers(members);

                const roles = new Set();
                members.forEach((member) => member.assignedRoles?.forEach((role) => roles.add(role.name)));
                setAvailableRoles(Array.from(roles));
            }).catch(() => {
                setError("Failed to load organization members");
            });
        }
    }, [isOpen, event, orgId]);

    if (!isOpen || !event) return null;

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await updateOrgEvent(orgId, event.id, formData);
            onSuccess();
            alert("Event details updated!");
        } catch {
            setError("Failed to update event details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAssignments = async () => {
        setIsLoading(true);
        setError("");
        try {
            await assignOrgEventUsers(orgId, event.id, {
                type: "specific",
                userIds: selectedUserIds
            });
            onSuccess();
            onClose();
        } catch {
            setError("Failed to update assignments");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteOrgEvent(orgId, event.id);
                onSuccess();
                onClose();
            } catch {
                setError("Failed to delete event");
            }
        }
    };

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Manage Event</h2>
                    <button onClick={onClose} className="text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>
                </div>

                <div className="mb-4 flex border-b border-gray-200">
                    <button className={`px-4 py-2 font-medium transition-colors ${activeTab === "details" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("details")}>Event Details</button>
                    <button className={`px-4 py-2 font-medium transition-colors ${activeTab === "assignments" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`} onClick={() => setActiveTab("assignments")}>Assignments ({selectedUserIds.length})</button>
                </div>

                {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                <div className="flex-1 overflow-y-auto">
                    {activeTab === "details" && (
                        <form id="update-org-event-form" onSubmit={handleUpdateDetails} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>
                                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
                                    <input type="datetime-local" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>
                                    <input type="datetime-local" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
                                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>
                                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"></textarea>
                            </div>
                        </form>
                    )}

                    {activeTab === "assignments" && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>

                            {availableRoles.length > 0 && (
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <h3 className="mb-3 font-semibold text-gray-800">Assign by Role</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {availableRoles.map((role) => (
                                            <label key={role} className="flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100">
                                                <input type="checkbox" checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} className="h-4 w-4 rounded text-blue-600" />
                                                <span className="text-sm font-medium capitalize">{role}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="rounded-lg border border-gray-200 p-4">
                                <h3 className="mb-3 font-semibold text-gray-800">Assign Specific Individuals</h3>
                                <div className="grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
                                    {orgMembers.map((member) => (
                                        <label key={member.users_id} className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-blue-50">
                                            <input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 rounded text-blue-600" />
                                            <div>
                                                <div className="text-sm font-medium">{member.User?.fname} {member.User?.lname}</div>
                                                <div className="text-xs text-gray-500">{member.assignedRoles?.map((role) => role.name).join(", ")}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <button type="button" onClick={handleDelete} className="text-sm font-medium text-red-600 transition-colors hover:text-red-800">Delete Event</button>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Done</button>
                        {activeTab === "details" ? (
                            <button type="submit" form="update-org-event-form" disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">{isLoading ? "Saving..." : "Save Details"}</button>
                        ) : (
                            <button type="button" onClick={handleSaveAssignments} disabled={isLoading} className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:opacity-50">{isLoading ? "Updating..." : "Update Assignments"}</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}