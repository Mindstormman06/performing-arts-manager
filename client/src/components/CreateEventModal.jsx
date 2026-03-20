import { useState, useEffect } from "react";
import { createShowEvent, getShowUsers, assignShowEventUsers } from "../services/api";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">
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

                {error && <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                <div className="flex-1 overflow-y-auto">
                    {activeTab === "details" && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="create-event-title" className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>
                                <input
                                    id="create-event-title"
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="create-event-date" className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        id="create-event-date"
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="create-event-start-time" className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
                                    <input
                                        id="create-event-start-time"
                                        type="time"
                                        required
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="create-event-end-time" className="mb-1 block text-sm font-medium text-gray-700">End Time</label>
                                    <input
                                        id="create-event-end-time"
                                        type="time"
                                        required
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="create-event-location" className="mb-1 block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    id="create-event-location"
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <label htmlFor="create-event-description" className="mb-1 block text-sm font-medium text-gray-700">Notes / Description</label>
                                <textarea
                                    id="create-event-description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500"
                                    placeholder="Optional notes..."
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {activeTab === "assignments" && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>

                            {availableRoles.length > 0 && (
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <h3 className="mb-3 font-semibold text-gray-800">Assign by Role</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {availableRoles.map(role => (
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
                                    {showMembers.map(member => (
                                        <label key={member.users_id} className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-blue-50">
                                            <input type="checkbox" checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} className="h-4 w-4 rounded text-blue-600" />
                                            <div>
                                                <div className="text-sm font-medium">{member.User?.fname} {member.User?.lname}</div>
                                                <div className="text-xs text-gray-500">
                                                    {member.assignedRoles?.map(r => r.name).join(', ')}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                    <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100">Cancel</button>
                    <button type="button" onClick={handleCreateEvent} disabled={isLoading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
                        {isLoading ? "Creating..." : "Create Event"}
                    </button>
                </div>
            </div>
        </div>
    );
}
