import ModalHyperButton from "../buttons/ModalHyperButton.jsx";
import ModalDeleteButton from "../buttons/ModalDeleteButton.jsx";

export default function MemberRow({
	member,
	onEditRoles,
	onRemove,
	canEditRoles = true,
	showStatus = false,
}) {
	return (
		<div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
			{/* Member Info */}
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<div>
						<p className="font-medium text-gray-900">
							{member.User?.fname} {member.User?.lname}
						</p>
						<p className="text-sm text-gray-600">{member.User?.email}</p>
					</div>
					{showStatus && member.status === "pending" && (
						<span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-800 text-xs sm:ml-2">
							Pending
						</span>
					)}
				</div>

				{/* Roles */}
				<div className="mt-2 flex flex-wrap gap-1">
					{member.assignedRoles?.map((role) => (
						<span
							key={role.id}
							className="rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs capitalize"
						>
							{role.name}
						</span>
					))}
				</div>
			</div>

			{/* Actions */}
			<div className="flex gap-2 sm:gap-3">
				{canEditRoles && member.assignedRoles && member.assignedRoles.length >= 0 && (
					<ModalHyperButton
						type="button"
						onClick={() => onEditRoles(member)}
						className="font-medium text-blue-600 hover:text-blue-800"
					>
						Edit Roles
					</ModalHyperButton>
				)}
				{canEditRoles && (
					<ModalDeleteButton
						type="button"
						onClick={() => onRemove(member.users_id)}
					>
						Remove
					</ModalDeleteButton>
				)}
			</div>
		</div>
	);
}

