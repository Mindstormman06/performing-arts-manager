import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import "./ScheduleCalendar.css";

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
				displayEventTime={false} /* <-- ADDED THIS PROP */
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
