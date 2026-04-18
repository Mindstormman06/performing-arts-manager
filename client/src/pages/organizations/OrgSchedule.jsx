import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CreateOrgEventModal from "../../components/modals/Organizations/CreateOrgEventModal.jsx";
import ManageOrgEventModal from "../../components/modals/Organizations/ManageOrgEventModal.jsx";
import DashboardSection from "../../components/ui/DashboardSection.jsx";
import ScheduleCalendarView from "../../components/ui/scheduling/ScheduleCalendarView.jsx";
import {
	getOrganizationUsers,
	getOrgCalendar,
	verifyToken,
} from "../../services/api.js";

export default function OrgSchedule() {
	const { orgId } = useParams();
	const [events, setEvents] = useState([]);
	const [userRoles, setUserRoles] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [viewMode, setViewMode] = useState("calendar");
	const [pendingCreateDate, setPendingCreateDate] = useState("");

	const fetchScheduleData = useCallback(async () => {
		try {
			setIsLoading(true);
			const authRes = await verifyToken();
			const currentUserId = authRes.data.user.id;

			const [calendarRes, usersRes] = await Promise.all([
				getOrgCalendar(orgId),
				getOrganizationUsers(orgId),
			]);

			setEvents(calendarRes.data.data);

			const myMembership = usersRes.data.find(
				(member) =>
					member.User?.id === currentUserId ||
					member.users_id === currentUserId,
			);
			if (myMembership?.assignedRoles) {
				setUserRoles(
					myMembership.assignedRoles.map((role) => role.name.toLowerCase()),
				);
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

	const canManageSchedule =
		userRoles.includes("president") || userRoles.includes("board-member");

	const formatDateForInput = (date) => {
		const local = new Date(date);
		local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
		return local.toISOString().slice(0, 10);
	};

	const openCreateModal = (dateValue = "") => {
		setPendingCreateDate(dateValue);
		setIsCreateModalOpen(true);
	};

	const handleCalendarDateClick = (dateObj) => {
		if (!canManageSchedule) return;
		openCreateModal(formatDateForInput(dateObj));
	};

	const handleCalendarEventClick = (event) => {
		if (!canManageSchedule) return;
		if (!event.show_id) {
			setSelectedEvent(event);
		}
	};

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
			<div className="flex min-h-[calc(100vh-9rem)] items-center justify-center font-semibold text-gray-500 text-xl">
				Loading Schedule...
			</div>
		);
	}

	return (
		<div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl flex-col p-4 sm:p-6 lg:p-8">
			<CreateOrgEventModal
				isOpen={isCreateModalOpen}
				onClose={() => {
					setIsCreateModalOpen(false);
					setPendingCreateDate("");
				}}
				orgId={orgId}
				initialDate={pendingCreateDate}
				onSuccess={fetchScheduleData}
			/>
			<ManageOrgEventModal
				isOpen={!!selectedEvent}
				onClose={() => setSelectedEvent(null)}
				orgId={orgId}
				event={selectedEvent}
				onSuccess={fetchScheduleData}
			/>

			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<Link
						to={`/orgs/${orgId}/overview`}
						className="font-medium text-blue-600 text-sm hover:underline"
					>
						&larr; Back to Organization Dashboard
					</Link>
					<h1 className="mt-1 font-bold text-3xl text-gray-900">
						Organization Schedule
					</h1>
				</div>

				<div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
					<button
						type="button"
						onClick={() => setViewMode("calendar")}
						className={`rounded-lg px-4 py-2 font-semibold text-sm transition-colors ${viewMode === "calendar" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
					>
						Calendar
					</button>
					<button
						type="button"
						onClick={() => setViewMode("list")}
						className={`rounded-lg px-4 py-2 font-semibold text-sm transition-colors ${viewMode === "list" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
					>
						Event List
					</button>
				</div>
			</div>

			{viewMode === "calendar" ? (
				<DashboardSection
					title="Schedule Calendar"
					actionTitle={canManageSchedule ? "Create Event" : undefined}
					onActionClick={
						canManageSchedule ? () => openCreateModal() : undefined
					}
					className="min-h-0 flex-1 xl:h-[clamp(42rem,calc(100vh-15rem),56rem)]"
				>
					<ScheduleCalendarView
						events={events}
						onDateClick={handleCalendarDateClick}
						onEventClick={
							canManageSchedule ? handleCalendarEventClick : undefined
						}
					/>
				</DashboardSection>
			) : (
				<DashboardSection
					title="Upcoming Events"
					actionTitle={canManageSchedule ? "Create Event" : undefined}
					onActionClick={
						canManageSchedule ? () => openCreateModal() : undefined
					}
					className="flex-1"
				>
					<div className="space-y-4">
						{events.length > 0 ? (
							events.map((event) => {
								const start = formatDateTime(event.start_time);
								const end = formatDateTime(event.end_time);
								const isOrgEvent = !event.show_id;

								return (
									<div
										key={event.id}
										className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow sm:flex-row sm:items-center"
									>
										<div className="flex items-start gap-4">
											<div className="flex min-w-16 flex-col items-center justify-center rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-700">
												<span className="font-bold text-xs uppercase tracking-wider">
													{start.date.split(",")[0]}
												</span>
												<span className="font-extrabold text-lg">
													{start.date.split(" ")[2]}
												</span>
											</div>

											<div>
												<div className="mb-1 flex flex-wrap items-center gap-2">
													<h3 className="font-bold text-gray-900 text-lg">
														{event.title}
													</h3>
													<span
														className={`rounded-full px-2.5 py-1 font-semibold text-xs ${isOrgEvent ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
													>
														{isOrgEvent
															? "Organization Event"
															: `Show: ${event.Show?.title || "Linked Show"}`}
													</span>
												</div>
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
															<span className="mr-3">
																Location: {event.location}
															</span>
														)}
														{event.description && (
															<span>Notes: {event.description}</span>
														)}
													</div>
												)}
											</div>
										</div>

										{canManageSchedule && isOrgEvent && (
											<div className="mt-4 sm:mt-0">
												<button
													type="button"
													onClick={() => setSelectedEvent(event)}
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
								No events have been scheduled for this organization yet.
							</div>
						)}
					</div>
				</DashboardSection>
			)}
		</div>
	);
}
