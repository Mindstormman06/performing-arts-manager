import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ManageShowMembersModal from "../components/ManageShowMembersModal";
import RoleModal from "../components/ShowRoleModal";
import DashboardSection from "../components/ui/DashboardSection";
import { IconButton } from "../components/ui/IconButton.jsx";
import MemberListItem from "../components/ui/users/MemberListItem";
import { getShowCalendar, getShowDashboard } from "../services/api";

export default function ShowOverview() {
	const { orgId, showId } = useParams();
	const navigate = useNavigate();

	const [showData, setShowData] = useState(null);
	const [events, setEvents] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [isManageMembersModalOpen, setIsManageMembersModalOpen] =
		useState(false);
	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	// Calendar State
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const [dashboardRes, calendarRes] = await Promise.all([
				getShowDashboard(showId),
				getShowCalendar(showId),
			]);
			setShowData(dashboardRes.data.data);
			setEvents(calendarRes.data.data || []);
		} catch (err) {
			console.error("Failed to fetch show data:", err);
		} finally {
			setIsLoading(false);
		}
	}, [showId]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const navLinks = [
		{ name: "Inventory Dashboard", path: "inventory", icon: "📦" },
		{ name: "Notes & Reports", path: "notes", icon: "📝" },
		{ name: "Scheduling", path: "scheduling", icon: "📅" },
		{ name: "Casting", path: "casting", icon: "🎭" },
		{ name: "Budgets & Expenses", path: "budgets", icon: "💰" },
		{ name: "Technical & Design Hub", path: "tech", icon: "💡" },
		{ name: "Files & Scripts", path: "files", icon: "📁" },
	];

	if (isLoading || !showData) {
		return (
			<div className="flex h-[calc(100vh-9rem)] items-center justify-center">
				<div className="font-semibold text-gray-500 text-xl">
					Loading Show Dashboard...
				</div>
			</div>
		);
	}

	const budgetTotal = showData.budget?.total || 0;
	const budgetSpent = showData.budget?.spent || 0;
	const percentSpent = budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;
	const isOverBudgetLimit = percentSpent > 85;

	// Calendar Grid Rendering Logic (GCal Style)
	const renderCalendarDays = () => {
		const daysInMonth = new Date(
			currentMonth.getFullYear(),
			currentMonth.getMonth() + 1,
			0,
		).getDate();
		const firstDay = new Date(
			currentMonth.getFullYear(),
			currentMonth.getMonth(),
			1,
		).getDay();
		const days = [];

		// Blank cells for alignment
		for (let i = 0; i < firstDay; i++) {
			days.push(
				<div key={`blank-${i}`} className="min-h-20 bg-gray-50/50"></div>,
			);
		}

		// Actual day cells
		for (let d = 1; d <= daysInMonth; d++) {
			const dateObj = new Date(
				currentMonth.getFullYear(),
				currentMonth.getMonth(),
				d,
			);
			const isSelected = selectedDate.toDateString() === dateObj.toDateString();
			const isToday = new Date().toDateString() === dateObj.toDateString();

			const dayEvents = events.filter(
				(e) => new Date(e.start_time).toDateString() === dateObj.toDateString(),
			);

			days.push(
				<button
					key={d}
					type="button"
					onClick={() => setSelectedDate(dateObj)}
					className={`flex min-h-20 cursor-pointer flex-col items-center border-transparent bg-white p-1 transition-colors ${isSelected ? "z-10 bg-blue-50/30 ring-2 ring-blue-500 ring-inset" : "hover:bg-gray-50"}`}
				>
					<span
						className={`mb-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs ${isToday ? "bg-blue-600 font-bold text-white" : isSelected ? "font-bold text-blue-700" : "text-gray-700"}`}
					>
						{d}
					</span>
					{/* GCal Style Event Text Blocks */}
					<div className="flex w-full flex-col gap-0.5 overflow-hidden px-0.5">
						{dayEvents.slice(0, 3).map((e) => (
							<div
								key={e.id}
								className="w-full truncate rounded bg-blue-100 px-1 py-0.5 text-left font-medium text-[10px] text-blue-700 leading-tight"
								title={e.title}
							>
								{e.title}
							</div>
						))}
						{dayEvents.length > 3 && (
							<div className="text-center font-medium text-[10px] text-gray-500">
								+{dayEvents.length - 3} more
							</div>
						)}
					</div>
				</button>,
			);
		}
		return days;
	};

	const selectedDayEvents = events.filter(
		(e) =>
			new Date(e.start_time).toDateString() === selectedDate.toDateString(),
	);

	return (
		<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-360 gap-6 p-4 sm:p-6 lg:p-8">
			<ManageShowMembersModal
				isOpen={isManageMembersModalOpen}
				onClose={() => setIsManageMembersModalOpen(false)}
				orgId={orgId}
				showId={showId}
				members={showData?.members || []}
				onSuccess={fetchData}
			/>
			<RoleModal
				isOpen={isRoleModalOpen}
				onClose={() => setIsRoleModalOpen(false)}
				user={selectedUser}
				showId={showId}
				onSuccess={fetchData}
			/>

			{/* Sidebar Navigation - UNTOUCHED */}
			<aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
				<div className="bg-gray-800 p-6 text-white">
					<h2 className="truncate font-bold text-xl" title={showData.title}>
						{showData.title}
					</h2>
					<p className="mt-1 text-gray-400 text-sm">Show Dashboard</p>
				</div>
				<nav className="flex-1 space-y-2 overflow-y-auto p-4">
					{navLinks.map((link) => (
						<Link
							key={link.name}
							to={`/orgs/${orgId}/shows/${showId}/${link.path}`}
							className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
						>
							<span>{link.icon}</span>
							{link.name}
						</Link>
					))}
				</nav>
			</aside>

			{/* Main Widget Grid */}
			<main className="flex-1 overflow-y-auto">
				<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					{/* Left/Center Column: Primary Widgets */}
					<div className="flex flex-col gap-6 xl:col-span-2">
						{/* Calendar Widget */}
						<DashboardSection
							title="Show Calendar"
							actionTitle="View Full Calendar"
							buttonColour="blue"
							buttonIcon="📅"
							onActionClick={() =>
								navigate(`/orgs/${orgId}/shows/${showId}/scheduling`)
							}
						>
							<div className="flex h-full flex-col">
								{/* Month Navigation */}
								<div className="mb-4 flex items-center justify-between">
									<IconButton
										onClick={() =>
											setCurrentMonth(
												new Date(
													currentMonth.getFullYear(),
													currentMonth.getMonth() - 1,
													1,
												),
											)
										}
										icon="◀"
										size="p1_5"
										colour="custom"
										customColour="hover:bg-gray-200 rounded text-gray-600"
										classes="transition-colors"
										shape="none"
									/>
									<h3 className="font-bold text-gray-800 text-lg">
										{currentMonth.toLocaleDateString("default", {
											month: "long",
											year: "numeric",
										})}
									</h3>
									<IconButton
										onClick={() =>
											setCurrentMonth(
												new Date(
													currentMonth.getFullYear(),
													currentMonth.getMonth() + 1,
													1,
												),
											)
										}
										icon="▶"
										size="p1_5"
										colour="custom"
										customColour="hover:bg-gray-200 rounded text-gray-600"
										classes="transition-colors"
										shape="none"
									/>
								</div>

								{/* Calendar Grid */}
								<div className="mb-2 grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 shadow-sm">
									{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
										(day) => (
											<div
												key={day}
												className="bg-gray-50 py-2 text-center font-bold text-gray-500 text-xs uppercase tracking-wider"
											>
												{day}
											</div>
										),
									)}
									{renderCalendarDays()}
								</div>

								{/* Selected Day Agenda */}
								<div className="mt-2 max-h-48 flex-1 overflow-y-auto">
									<h4 className="sticky top-0 mb-2 border-gray-200 border-b bg-gray-50 pt-2 pb-2 font-bold text-gray-700 text-sm">
										{selectedDate.toLocaleDateString("default", {
											weekday: "long",
											month: "long",
											day: "numeric",
										})}
									</h4>
									{selectedDayEvents.length > 0 ? (
										<ul className="space-y-2">
											{selectedDayEvents.map((event) => (
												<li
													key={event.id}
													className="flex flex-col rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-300"
												>
													<span className="font-bold text-gray-900 text-sm">
														{event.title}
													</span>
													<div className="mt-1 flex items-center justify-between">
														<span className="font-medium text-blue-600 text-xs">
															{new Date(event.start_time).toLocaleTimeString(
																[],
																{ hour: "2-digit", minute: "2-digit" },
															)}{" "}
															-{" "}
															{new Date(event.end_time).toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}
														</span>
														{event.location && (
															<span className="text-gray-500 text-xs">
																📍 {event.location}
															</span>
														)}
													</div>
												</li>
											))}
										</ul>
									) : (
										<p className="py-3 text-center text-gray-500 text-sm italic">
											No events scheduled.
										</p>
									)}
								</div>
							</div>
						</DashboardSection>

						{/* Compact Budget Widget - UNTOUCHED */}
						<DashboardSection
							title="Budget Overview"
							actionTitle="Manage Budget"
							className="flex-none"
							onActionClick={() => console.log("Navigate to budget")}
						>
							<div className="flex flex-col gap-2 pt-2">
								<div className="flex justify-between font-medium text-sm">
									<span className="text-gray-600">Spent: ${budgetSpent}</span>
									<span className="text-gray-600">Total: ${budgetTotal}</span>
								</div>
								<div className="h-2.5 w-full rounded-full bg-gray-200">
									<div
										className={`h-2.5 rounded-full ${
											isOverBudgetLimit ? "bg-red-500" : "bg-green-500"
										}`}
										style={{ width: `${Math.min(percentSpent, 100)}%` }}
									/>
								</div>
							</div>
						</DashboardSection>
					</div>

					{/* Right Column: People - UNTOUCHED */}
					<div className="flex flex-col gap-6">
						<DashboardSection
							title="Cast & Crew"
							actionTitle="Manage Roster"
							className="h-full"
							onActionClick={() => setIsManageMembersModalOpen(true)}
						>
							<ul className="space-y-3">
								{showData.members?.length > 0 ? (
									showData.members.map((m) => (
										<MemberListItem
											key={m.assignment_id || m.id}
											member={m}
											onClick={() => {
												setSelectedUser(m);
												setIsRoleModalOpen(true);
											}}
										/>
									))
								) : (
									<li className="py-4 text-center text-gray-500 italic">
										No members assigned to this show yet.
									</li>
								)}
							</ul>
						</DashboardSection>
					</div>
				</div>
			</main>
		</div>
	);
}
