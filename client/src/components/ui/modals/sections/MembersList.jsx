import MemberRow from "./MemberRow.jsx";
import ModalSubsection from "./ModalSubsection.jsx";

/**
 * A boxed list of `MemberRow`s, or an empty-state message when there are no
 * members.
 *
 * @remarks
 * Stateless. Passes the edit and remove handlers, the edit permission and the
 * status flag through to every row. The empty-state text can be overridden.
 */
export default function MembersList({
	members,
	onEditRoles,
	onRemove,
	canEditRoles = true,
	emptyMessage = "No members",
	showStatus = false,
}) {
	if (!members || members.length === 0) {
		return (
			<ModalSubsection>
				<p className="text-center text-gray-500 text-sm italic">
					{emptyMessage}
				</p>
			</ModalSubsection>
		);
	}

	return (
		<ModalSubsection>
			<div className="grid gap-3 sm:gap-4">
				{members.map((member) => (
					<MemberRow
						key={member.assignment_id || member.users_id}
						member={member}
						onEditRoles={onEditRoles}
						onRemove={onRemove}
						canEditRoles={canEditRoles}
						showStatus={showStatus}
					/>
				))}
			</div>
		</ModalSubsection>
	);
}
