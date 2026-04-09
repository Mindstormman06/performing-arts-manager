import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getShowCalendar, verifyToken, getShowUsers } from "../../services/api.js";
import DashboardSection from "../../components/ui/DashboardSection.jsx";
import CreateEventModal from "../../components/modals/Shows/CreateEventModal.jsx";
import ManageEventModal from "../../components/modals/Shows/ManageEventModal.jsx";

export default function ShowSchedule() {
    const { orgId, showId } = useParams();
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
                getShowCalendar(showId),
                getShowUsers(showId)
            ]);

            setEvents(calendarRes.data.data);

            const myMembership = usersRes.data.find(u => u.User?.id === currentUserId || u.users_id === currentUserId);
            if (myMembership && myMembership.assignedRoles) {
                setUserRoles(myMembership.assignedRoles.map(r => r.name.toLowerCase()));
            }
        } catch (err) {
            console.error("Failed to fetch schedule data", err);
        } finally {
            setIsLoading(false);
        }
    }, [showId]);

    useEffect(() => {
        fetchScheduleData();
    }, [fetchScheduleData]);

    const canManageSchedule = userRoles.includes("director") || userRoles.includes("stage-manager");

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
            time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (isLoading) {
         return <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">Loading Schedule...</div>;
    }

    return (
        <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
            <CreateEventModal
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                showId={showId} 
                onSuccess={fetchScheduleData} 
            />

            <ManageEventModal 
                isOpen={!!selectedEvent} 
                onClose={() => setSelectedEvent(null)} 
                showId={showId} 
                event={selectedEvent} 
                onSuccess={fetchScheduleData} 
            />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link to={`/orgs/${orgId}/shows/${showId}`} className="text-sm font-medium text-blue-600 hover:underline">
                        &larr; Back to Show Dashboard
                    </Link>
                    <h1 className="mt-1 text-3xl font-bold text-gray-900">Show Schedule</h1>
                </div>
            </div>

            <DashboardSection 
                title="Upcoming Events"
                actionTitle="Create Event"
                onActionClick={canManageSchedule ? () => setIsCreateModalOpen(true) : undefined}
                className="flex-1"
            >
                <div className="space-y-4">
                    {events.length > 0 ? events.map(event => {
                        const start = formatDateTime(event.start_time);
                        const end = formatDateTime(event.end_time);
                        
                        return (
                            <div key={event.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow">
                                <div className="flex items-start gap-4">
                                    {/* Date Badge */}
                                    <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg p-2 min-w-16 border border-blue-100">
                                        <span className="text-xs font-bold uppercase tracking-wider">{start.date.split(',')[0]}</span>
                                        <span className="text-lg font-extrabold">{start.date.split(' ')[2]}</span>
                                    </div>
                                    
                                    {/* Event Details */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-tight">
                                            {new Date(event.start_time).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">
                                            {start.time} - {end.time}
                                        </p>
                                        {(event.location || event.description) && (
                                            <div className="mt-1 text-sm text-gray-500">
                                                {event.location && <span className="mr-3">📍 {event.location}</span>}
                                                {event.description && <span>📝 {event.description}</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Manage Button */}
                                {canManageSchedule && (
                                    <div className="mt-4 sm:mt-0">
                                        <button 
                                            onClick={() => {
                                                setSelectedEvent(event);
                                            }}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    }) : (
                        <div className="text-center py-12 text-gray-500 italic">
                            No events have been scheduled for this show yet.
                        </div>
                    )}
                </div>
            </DashboardSection>
        </div>
    );

}