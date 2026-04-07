import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CreateEventModal from "../components/CreateEventModal";
import ManageEventModal from "../components/ManageEventModal";
import DashboardSection from "../components/ui/DashboardSection.jsx";
import { getShowCalendar, getShowUsers, verifyToken } from "../services/api.js";

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
				getShowUsers(showId),
			]);

			setEvents(calendarRes.data.data);

			const myMembership = usersRes.data.find(
				(u) => u.User?.id === currentUserId || u.users_id === currentUserId,
			);
			if (myMembership?.assignedRoles) {
				setUserRoles(
					myMembership.assignedRoles.map((r) => r.name.toLowerCase()),
				);
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

	const canManageSchedule =
		userRoles.includes("director") || userRoles.includes("stage-manager");

	const formatDateTime = (dateString) => {
		const date = new Date(dateString);
		return {
			date: date.toLocaleDateString(undefined, {
				weekday: "short",
				month: "short",
				day: "numeric",
			}),
			time: date.toLocaleTimeString(undefined, {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};
	};

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">
				Loading Schedule...
			</div>
		);
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
					<Link
						to={`/orgs/${orgId}/shows/${showId}`}
						className="font-medium text-blue-600 text-sm hover:underline"
					>
						&larr; Back to Show Dashboard
					</Link>
					<h1 className="mt-1 font-bold text-3xl text-gray-900">
						Show Schedule
					</h1>
				</div>
			</div>

			<DashboardSection
				title="Upcoming Events"
				actionTitle="Create Event"
				onActionClick={
					canManageSchedule ? () => setIsCreateModalOpen(true) : undefined
				}
				className="flex-1"
			>
				<div className="space-y-4">
					{events.length > 0 ? (
						events.map((event) => {
							const start = formatDateTime(event.start_time);
							const end = formatDateTime(event.end_time);

							return (
								<div
									key={event.id}
									className="flex flex-col items-start justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow sm:flex-row sm:items-center"
								>
									<div className="flex items-start gap-4">
										{/* Date Badge */}
										<div className="flex min-w-16 flex-col items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-700">
											<span className="font-bold text-xs uppercase tracking-wider">
												{start.date.split(",")[0]}
											</span>
											<span className="font-extrabold text-lg">
												{start.date.split(" ")[2]}
											</span>
										</div>

										{/* Event Details */}
										<div>
											<h3 className="font-bold text-gray-900 text-lg">
												{event.title}
											</h3>
											<p className="font-semibold text-blue-600 text-sm uppercase tracking-tight">
												{new Date(event.start_time).toLocaleDateString(
													undefined,
													{ month: "long", day: "numeric", year: "numeric" },
												)}
											</p>
											<p className="font-medium text-gray-600 text-sm">
												{start.time} - {end.time}
											</p>
											{(event.location || event.description) && (
												<div className="mt-1 text-gray-500 text-sm">
													{event.location && (
														<span className="mr-3">📍 {event.location}</span>
													)}
													{event.description && (
														<span>📝 {event.description}</span>
													)}
												</div>
											)}
										</div>
									</div>

									{/* Manage Button */}
									{canManageSchedule && (
										<div className="mt-4 sm:mt-0">
											<button
												type="button"
												onClick={() => {
													setSelectedEvent(event);
												}}
												className="rounded bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
											>
												Manage
											</button>
										</div>
									)}
								</div>
							);
						})
					) : (
						<div className="py-12 text-center text-gray-500 italic">
							No events have been scheduled for this show yet.
						</div>
					)}
				</div>
			</DashboardSection>
		</div>
	);
}
