import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CreateOrgEventModal from "../../components/modals/Organizations/CreateOrgEventModal.jsx";
import ManageOrgEventModal from "../../components/modals/Organizations/ManageOrgEventModal.jsx";
import DashboardSection from "../../components/ui/DashboardSection.jsx";
import { getOrgCalendar, getOrganizationUsers, verifyToken } from "../../services/api.js";

export default function OrgSchedule() {
    const { orgId } = useParams();
    const [events, setEvents] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchScheduleData = useCallback(async () => {
        try {
            setIsLoading(true);
            const authRes = await verifyToken();
            const currentUserId = authRes.data.user.id;

            const [calendarRes, usersRes] = await Promise.all([
                getOrgCalendar(orgId),
                getOrganizationUsers(orgId)
            ]);

            setEvents(calendarRes.data.data);

            const myMembership = usersRes.data.find((member) => member.User?.id === currentUserId || member.users_id === currentUserId);
            if (myMembership?.assignedRoles) {
                setUserRoles(myMembership.assignedRoles.map((role) => role.name.toLowerCase()));
            }
        } catch (err) {
            console.error("Failed to fetch organizations schedule data", err);
        } finally {
            setIsLoading(false);
        }
    }, [orgId]);

    useEffect(() => {
        fetchScheduleData();
    }, [fetchScheduleData]);

    const canManageSchedule = userRoles.includes("president") || userRoles.includes("board-member");

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
            time: date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
        };
    };

    if (isLoading) {
        return <div className="flex h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">Loading Schedule...</div>;
    }

    return (
        <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
            <CreateOrgEventModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} orgId={orgId} onSuccess={fetchScheduleData} />
            <ManageOrgEventModal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} orgId={orgId} event={selectedEvent} onSuccess={fetchScheduleData} />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link to={`/orgs/${orgId}/overview`} className="text-sm font-medium text-blue-600 hover:underline">&larr; Back to Organization Dashboard</Link>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900">Organization Schedule</h1>
                </div>
            </div>

            <DashboardSection title="Upcoming Events" actionTitle="Create Event" onActionClick={canManageSchedule ? () => setIsCreateModalOpen(true) : undefined} className="flex-1">
                <div className="space-y-4">
                    {events.length > 0 ? events.map((event) => {
                        const start = formatDateTime(event.start_time);
                        const end = formatDateTime(event.end_time);
                        const isOrgEvent = !event.show_id;

                        return (
                            <div key={event.id} className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow sm:flex-row sm:items-center">
                                <div className="flex items-start gap-4">
                                    <div className="flex min-w-16 flex-col items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-700">
                                        <span className="text-xs font-bold uppercase tracking-wider">{start.date.split(",")[0]}</span>
                                        <span className="text-lg font-extrabold">{start.date.split(" ")[2]}</span>
                                    </div>

                                    <div>
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isOrgEvent ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                                                {isOrgEvent ? "Organization Event" : `Show: ${event.Show?.title || "Linked Show"}`}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold uppercase tracking-tight text-blue-600">
                                            {new Date(event.start_time).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                                        </p>
                                        <p className="text-sm font-medium text-gray-600">{start.time} - {end.time}</p>
                                        {(event.location || event.description) && (
                                            <div className="mt-1 text-sm text-gray-500">
                                                {event.location && <span className="mr-3">Location: {event.location}</span>}
                                                {event.description && <span>Notes: {event.description}</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {canManageSchedule && isOrgEvent && (
                                    <div className="mt-4 sm:mt-0">
                                        <button onClick={() => setSelectedEvent(event)} className="rounded bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200">Manage</button>
                                    </div>
                                )}
                            </div>
                        );
                    }) : (
                        <div className="py-12 text-center italic text-gray-500">No events have been scheduled for this organization yet.</div>
                    )}
                </div>
            </DashboardSection>
        </div>
    );
}