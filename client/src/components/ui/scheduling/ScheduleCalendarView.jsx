import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import "./ScheduleCalendar.css";

/**
 * A month-grid calendar of scheduled events built on FullCalendar.
 *
 * @remarks
 * Stateless wrapper around `@fullcalendar/react` with the day-grid and
 * interaction plugins. Maps the parent's events (using `id`, `title`,
 * `start_time`, `end_time`) to FullCalendar events and keeps the original
 * object in `extendedProps`, so the event-click callback receives the event as
 * the parent supplied it; the date-click callback receives a `Date`. When asked
 * to fill its container it expands rows to the parent's height, otherwise it
 * sizes itself by aspect ratio. Imports `ScheduleCalendar.css`, which restyles
 * FullCalendar under the `pam-calendar-wrapper` class.
 */
export default function ScheduleCalendarView({
	events = [],
	onDateClick,
	onEventClick,
	fillSpace = false,
}) {
	const calendarEvents = events.map((event) => ({
		id: String(event.id),
		title: event.title || "(No title)",
		start: event.start_time,
		end: event.end_time,
		extendedProps: { originalEvent: event },
	}));

	return (
		<div className="pam-calendar-wrapper h-full min-h-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				height="100%"
				headerToolbar={{
					left: "prev,today,next",
					center: "title",
					right: "",
				}}
				buttonText={{ today: "Today" }}
				events={calendarEvents}
				dateClick={(info) => onDateClick?.(info.date)}
				eventClick={(info) =>
					onEventClick?.(info.event.extendedProps.originalEvent)
				}
				eventDisplay="block"
				displayEventTime={false}
				dayMaxEvents={3}
				fixedWeekCount={fillSpace}
				expandRows={fillSpace}
				showNonCurrentDates={true}
				dayCellClassNames="cursor-pointer transition-colors hover:bg-gray-50"
				moreLinkClick="popover"
				allDaySlot={false}
				aspectRatio={fillSpace ? undefined : 1.65}
				contentHeight={fillSpace ? undefined : "auto"}
			/>
		</div>
	);
}
