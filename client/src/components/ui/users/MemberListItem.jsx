export default function MemberListItem({ member, onClick }) {
	const { fname, lname } = member.User || {};
	const initials = `${fname?.charAt(0) || ""}${lname?.charAt(0) || ""}`;
	const isPending = member.status === "pending";

	return (
		<li>
			<button
				type="button"
				className={`flex w-full cursor-pointer items-center rounded-lg border border-gray-100 bg-white px-4 py-3 text-left font-medium shadow-sm transition-all hover:border-blue-300 hover:shadow-md focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
					isPending ? "opacity-75" : "text-gray-700"
				}`}
				onClick={onClick}
			>
				<div
					className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
						isPending
							? "bg-gray-100 text-gray-400"
							: "bg-indigo-100 text-indigo-700"
					}`}
				>
					{initials}
				</div>

				<div className="flex min-w-0 flex-1 items-center justify-between">
					<span className="truncate">
						{fname} {lname}
					</span>

					{isPending && (
						<span className="ml-2 rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 font-bold text-[10px] text-amber-600 uppercase tracking-wider">
							Pending
						</span>
					)}
				</div>
			</button>
		</li>
	);
}
