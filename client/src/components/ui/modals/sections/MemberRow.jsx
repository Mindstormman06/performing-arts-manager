import ModalDeleteButton from "../buttons/ModalDeleteButton.jsx";
import ModalHyperButton from "../buttons/ModalHyperButton.jsx";

/**
 * One row in a member list showing a member's name, email, roles and management
 * actions.
 *
 * @remarks
 * Stateless. Reads the name and email from the member's nested `User` record
 * and lists its assigned roles as badges; a "Pending" badge appears when the
 * parent asks for status and the membership is pending. When editing is allowed
 * it shows "Edit Roles", which hands the whole member to the parent, and
 * "Remove", which hands over the member's `users_id`.
 */
export default function MemberRow({
	member,
	onEditRoles,
	onRemove,
	canEditRoles = true,
	showStatus = false,
}) {
	return (
		<div className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<div>
						<p className="font-medium text-gray-900">
							{member.User?.fname} {member.User?.lname}
						</p>
						<p className="text-gray-600 text-sm">{member.User?.email}</p>
					</div>
					{showStatus && member.status === "pending" && (
						<span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-800 text-xs sm:ml-2">
							Pending
						</span>
					)}
				</div>

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

			<div className="flex gap-2 sm:gap-3">
				{canEditRoles &&
					member.assignedRoles &&
					member.assignedRoles.length >= 0 && (
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
