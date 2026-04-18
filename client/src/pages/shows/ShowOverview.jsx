import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ManageShowMembersModal from "../../components/modals/Shows/ManageShowMembersModal.jsx";
import RoleModal from "../../components/modals/Shows/ShowRoleModal.jsx";
import DashboardSection from "../../components/ui/DashboardSection.jsx";
import ScheduleCalendarView from "../../components/ui/scheduling/ScheduleCalendarView.jsx";
import MemberListItem from "../../components/ui/users/MemberListItem.jsx";
import {
	getShowCalendar,
	getShowDashboard,
	verifyToken,
} from "../../services/api.js";

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
	const [selectedCalendarEvent, setSelectedCalendarEvent] = useState(null);
	const [currentUserRoles, setCurrentUserRoles] = useState([]);
	const [currentUserId, setCurrentUserId] = useState(null);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const [dashboardRes, calendarRes, authRes] = await Promise.all([
				getShowDashboard(showId),
				getShowCalendar(showId),
				verifyToken(),
			]);
			const currentUserId = authRes.data.user.id;
			setCurrentUserId(currentUserId);
			const currentMember = (dashboardRes.data.data?.members || []).find(
				(member) =>
					member.User?.id === currentUserId ||
					member.users_id === currentUserId,
			);
			setCurrentUserRoles(
				(currentMember?.assignedRoles || []).map((role) =>
					String(role.name || "").toLowerCase(),
				),
			);
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

	const desktopPanelHeightClass = "xl:h-[clamp(44rem,calc(100vh-15rem),56rem)]";

	// Add/remove paths here to mark sidebar items as under construction.
	const underConstructionPaths = new Set(["notes", "budgets", "tech", "files"]);

	const navLinks = [
		{ name: "Inventory", path: "inventory", icon: "📦" },
		{ name: "Notes", path: "notes", icon: "📝" },
		{ name: "Scheduling", path: "scheduling", icon: "📅" },
		{ name: "Casting", path: "casting", icon: "🎭" },
		{ name: "Budgeting", path: "budgets", icon: "💰" },
		{ name: "Design Hub", path: "tech", icon: "💡" },
		{ name: "Files & Scripts", path: "files", icon: "📁" },
	];

	if (isLoading || !showData) {
		return (
			<div className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
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

	const formatEventDateTime = (dateString) =>
		new Date(dateString).toLocaleString([], {
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	const sortedMembers = [...(showData.members || [])].sort((a, b) => {
		const aFirst = String(a.User?.fname || "").toLowerCase();
		const aLast = String(a.User?.lname || "").toLowerCase();
		const bFirst = String(b.User?.fname || "").toLowerCase();
		const bLast = String(b.User?.lname || "").toLowerCase();
		const fullA = `${aLast} ${aFirst}`.trim();
		const fullB = `${bLast} ${bFirst}`.trim();
		return fullA.localeCompare(fullB);
	});

	const getRoleSubtitle = (member) => {
		const toTitleCaseRole = (roleName) =>
			String(roleName)
				.replace(/[-_]+/g, " ")
				.split(" ")
				.filter(Boolean)
				.map(
					(part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
				)
				.join(" ");

		const roles = (member.assignedRoles || [])
			.map((role) => role.name)
			.filter(Boolean)
			.map(toTitleCaseRole);
		return roles.length > 0 ? roles.join(", ") : "No roles assigned";
	};

	const canEditRoles = currentUserRoles.some((role) =>
		[
			"president",
			"board-member",
			"director",
			"stage-manager",
			"admin",
		].includes(role),
	);

	return (
		<div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-360 gap-6 p-4 sm:p-6 lg:p-8">
			<ManageShowMembersModal
				isOpen={isManageMembersModalOpen}
				onClose={() => setIsManageMembersModalOpen(false)}
				orgId={orgId}
				showId={showId}
				members={showData?.members || []}
				canEditRoles={canEditRoles}
				onSuccess={fetchData}
			/>
			<RoleModal
				isOpen={isRoleModalOpen}
				onClose={() => setIsRoleModalOpen(false)}
				user={selectedUser}
				showId={showId}
				canEditRoles={canEditRoles}
				currentUserId={currentUserId}
				currentUserRoles={currentUserRoles}
				onSuccess={fetchData}
			/>

			{selectedCalendarEvent && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
					role="dialog"
					aria-modal="true"
				>
					<div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
						<div className="mb-3 flex items-start justify-between gap-4">
							<div>
								<h3 className="font-bold text-gray-900 text-lg">
									{selectedCalendarEvent.title || "(No title)"}
								</h3>
								<p className="mt-1 font-medium text-blue-600 text-sm">
									{formatEventDateTime(selectedCalendarEvent.start_time)} -{" "}
									{formatEventDateTime(selectedCalendarEvent.end_time)}
								</p>
							</div>
							<button
								type="button"
								onClick={() => setSelectedCalendarEvent(null)}
								className="cursor-pointer rounded-lg px-2 py-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
							>
								✕
							</button>
						</div>

						{selectedCalendarEvent.location && (
							<p className="mb-2 text-gray-700 text-sm">
								📍 {selectedCalendarEvent.location}
							</p>
						)}

						{selectedCalendarEvent.description ? (
							<p className="mb-4 text-gray-600 text-sm leading-6">
								{selectedCalendarEvent.description}
							</p>
						) : (
							<p className="mb-4 text-gray-500 text-sm italic">
								No description provided.
							</p>
						)}

						<div className="flex items-center justify-end gap-2">
							<button
								type="button"
								onClick={() => setSelectedCalendarEvent(null)}
								className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
							>
								Close
							</button>
							<button
								type="button"
								onClick={() =>
									navigate(`/orgs/${orgId}/shows/${showId}/scheduling`)
								}
								className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-sm text-white hover:bg-blue-700"
							>
								Open Full Schedule
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Sidebar Navigation */}
			<aside className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
				<div className="bg-gray-800 p-6 text-white">
					<h2 className="truncate font-bold text-xl" title={showData.title}>
						{showData.title}
					</h2>
					<p className="mt-1 text-gray-400 text-sm">Show Dashboard</p>
				</div>
				<nav className="flex-1 space-y-2 overflow-y-auto p-4">
					{navLinks.map((link) => {
						const isUnderConstruction = underConstructionPaths.has(link.path);

						if (isUnderConstruction) {
							return (
								<div
									key={link.name}
									className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 font-medium text-amber-700"
									title="Under construction"
									aria-disabled="true"
								>
									<span>🚧</span>
									{link.name}
								</div>
							);
						}

						return (
							<Link
								key={link.name}
								to={`/orgs/${orgId}/shows/${showId}/${link.path}`}
								className="flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
							>
								<span>{link.icon}</span>
								{link.name}
							</Link>
						);
					})}
				</nav>
			</aside>

			{/* Main Widget Grid */}
			<main className="min-h-0 flex-1 overflow-y-auto">
				<div className="grid min-h-0 grid-cols-1 gap-6 xl:grid-cols-3 xl:items-stretch">
					{/* Left/Center Column: Primary Widgets */}
					<div className="flex min-h-0 flex-col gap-6 xl:col-span-2">
						{/* Calendar Widget */}
						<DashboardSection
							title="Show Calendar"
							actionTitle="View Full Calendar"
							buttonColour="blue"
							buttonIcon="📅"
							className={desktopPanelHeightClass}
							onActionClick={() =>
								navigate(`/orgs/${orgId}/shows/${showId}/scheduling`)
							}
						>
							<ScheduleCalendarView
								events={events}
								fillSpace
								onEventClick={(event) => setSelectedCalendarEvent(event)}
							/>
						</DashboardSection>

						{/* Compact Budget Widget */}
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

					{/* Right Column: People  */}
					<div className="flex h-full min-h-0 flex-col gap-6 self-stretch">
						<DashboardSection
							title="Cast & Crew"
							actionTitle="Manage Roster"
							className={`${desktopPanelHeightClass} min-h-0`}
							onActionClick={
								canEditRoles
									? () => setIsManageMembersModalOpen(true)
									: undefined
							}
						>
							<ul className="space-y-3">
								{sortedMembers.length > 0 ? (
									sortedMembers.map((m) => (
										<MemberListItem
											key={m.assignment_id || m.id}
											member={m}
											secondaryText={getRoleSubtitle(m)}
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
