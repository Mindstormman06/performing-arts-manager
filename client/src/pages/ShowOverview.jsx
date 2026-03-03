import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getShowDashboard } from "../services/api";
import DashboardSection from "../components/ui/DashboardSection";
import MemberListItem from "../components/ui/users/MemberListItem";

export default function ShowOverview() {
	const { orgId, showId } = useParams();

	const [showData, setShowData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const res = await getShowDashboard(showId);
			// Axios puts the response body in .data, and our controller sends { success: true, data: summary }
			setShowData(res.data.data); 
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

	// Safe budget calculations to prevent division by zero
	const budgetTotal = showData.budget?.total || 0;
	const budgetSpent = showData.budget?.spent || 0;
	const percentSpent = budgetTotal > 0 ? (budgetSpent / budgetTotal) * 100 : 0;
	const isOverBudgetLimit = percentSpent > 85;

	return (
		<div className="mx-auto flex h-[calc(100vh-9rem)] max-w-[90rem] gap-6 p-4 sm:p-6 lg:p-8">
			{/* Sidebar Navigation */}
			<aside className="flex w-64 flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
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
						{/* Up Next Widget */}
						<DashboardSection
							title="Up Next"
							actionTitle="View Full Calendar"
							buttonColour="blue"
							icon="→"
							onActionClick={() => console.log("Navigate to schedule")}
						>
							<ul className="divide-y divide-gray-100">
								{showData.schedule?.length > 0 ? (
									showData.schedule.map((event) => (
										<li
											key={event.id}
											className="flex items-center justify-between py-3"
										>
											<span className="font-medium text-gray-800">
												{event.title || "Scheduled Event"}
											</span>
											<span className="text-gray-500 text-sm">
												{new Date(event.start_time).toLocaleString()}
											</span>
										</li>
									))
								) : (
									<li className="py-4 text-center italic text-gray-500">
										No upcoming events scheduled.
									</li>
								)}
							</ul>
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

					{/* Right Column: People */}
					<div className="flex flex-col gap-6">
						<DashboardSection
							title="Cast & Crew"
							actionTitle="Manage Roster"
							className="h-full"
							onActionClick={() => console.log("Open roster modal/page")}
						>
							<ul className="space-y-3">
								{showData.members?.length > 0 ? (
									showData.members.map((m) => (
										<MemberListItem
											key={m.assignment_id || m.id}
											member={m}
											onClick={() => console.log("View member details", m)}
										/>
									))
								) : (
									<li className="py-4 text-center italic text-gray-500">
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