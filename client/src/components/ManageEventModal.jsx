import { useState, useEffect } from "react";
import { updateShowEvent, deleteShowEvent, assignShowEventUsers, getShowUsers } from "../services/api";
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

export default function ManageEventModal({ isOpen, onClose, showId, event, onSuccess }) {
    const [activeTab, setActiveTab] = useState("details");
    
    const [formData, setFormData] = useState({ title: "", start_time: "", end_time: "", location: "", description: "" });
    
    // Assignment State
    const [showMembers, setShowMembers] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Initialize data when modal opens
    useEffect(() => {
        if (isOpen && event) {
            // Helper to format DB dates for the <input type="datetime-local">
            const formatForInput = (dateString) => {
                if (!dateString) return "";
                const d = new Date(dateString);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                return d.toISOString().slice(0, 16);
            };

            setFormData({
                title: event.title || "",
                start_time: formatForInput(event.start_time),
                end_time: formatForInput(event.end_time),
                location: event.location || "",
                description: event.description || ""
            });
            
            // Pre-select currently assigned users
            const currentAssignees = (event.attendees || event.Users || []).map(user => user.id);
            setSelectedUserIds(currentAssignees);
            
            // Fetch show members to populate checkboxes
            getShowUsers(showId).then(res => {
                const members = res.data;
                setShowMembers(members);
                
                const roles = new Set();
                members.forEach(m => {
                    if (m.assignedRoles) m.assignedRoles.forEach(r => roles.add(r.name));
                });
                setAvailableRoles(Array.from(roles));
            }).catch(console.error);
        }
    }, [isOpen, event, showId]);

    if (!isOpen || !event) return null;

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            await updateShowEvent(showId, event.id, formData);
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
            await assignShowEventUsers(showId, event.id, {
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
        if (window.confirm("Are you sure you want to delete this event? This will remove it from the organization calendar as well.")) {
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

    return (
        <ModalWrapper>
            <div className="w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Manage Event</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-4">
                    <button 
                        className={`py-2 px-4 font-medium transition-colors ${activeTab === "details" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("details")}
                    >
                        Event Details
                    </button>
                    <button 
                        className={`py-2 px-4 font-medium transition-colors ${activeTab === "assignments" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("assignments")}
                    >
                        Assignments ({selectedUserIds.length})
                    </button>
                </div>

                {error && <ModalError>{error}</ModalError>}

                <div className="flex-1 overflow-y-auto">
                    {/* DETAILS TAB */}
                    {activeTab === "details" && (
                        <form id="update-event-form" onSubmit={handleUpdateDetails} className="space-y-4">
                             <div>
                                <ModalLabel>Event Title</ModalLabel>
                                <ModalInput type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <ModalLabel>Start Time</ModalLabel>
                                    <ModalInput type="datetime-local" required value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} />
                                </div>
                                <div>
                                    <ModalLabel>End Time</ModalLabel>
                                    <ModalInput type="datetime-local" required value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <ModalLabel>Location</ModalLabel>
                                <ModalInput type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                            </div>
                            <div>
                                <ModalLabel>Notes / Description</ModalLabel>
                                <ModalTextarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                        </form>
                    )}

                    {/* ASSIGNMENTS TAB */}
                    {activeTab === "assignments" && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600">Select roles or specific individuals who are required to attend this event.</p>
                            
                            {/* Role Selectors */}
                            {availableRoles.length > 0 && (
                                <ModalSubsection>
                                    <ModalSubHeader>Assign by Role</ModalSubHeader>
                                    <div className="flex flex-wrap gap-3">
                                        {availableRoles.map(role => (
                                            <label key={role} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded border border-gray-200 hover:bg-gray-100">
                                                <ModalCheckbox checked={isRoleFullySelected(role)} onChange={() => toggleRole(role)} />
                                                <span className="capitalize text-sm font-medium">{role}</span>
                                            </label>
                                        ))}
                                    </div>
                                </ModalSubsection>
                            )}

                            {/* Individual Selectors */}
                            <ModalSubsection>
                                <ModalSubHeader>Assign Specific Individuals</ModalSubHeader>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                                    {showMembers.map(member => (
                                        <label key={member.users_id} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-blue-50">
                                            <ModalCheckbox checked={selectedUserIds.includes(member.users_id)} onChange={() => toggleUser(member.users_id)} />
                                            <div>
                                                <div className="text-sm font-medium">{member.User?.fname} {member.User?.lname}</div>
                                                <div className="text-xs text-gray-500">
                                                    {member.assignedRoles?.map(r => r.name).join(', ')}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </ModalSubsection>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
                    <button type="button" onClick={handleDelete} className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors">
                        Delete Event
                    </button>
                    
                    <div className="flex gap-3">
                        <ModalCancelButton onClick={onClose}>Done</ModalCancelButton>
                        
                        {activeTab === "details" ? (
                            <ModalSubmitButton type="submit" form="update-event-form" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Details"}
                            </ModalSubmitButton>
                        ) : (
                            <button type="button" onClick={handleSaveAssignments} disabled={isLoading} className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:opacity-50">
                                {isLoading ? "Updating..." : "Update Assignments"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
}