import MemberRow from "./MemberRow.jsx";
import ModalSubsection from "./ModalSubsection.jsx";

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
				<p className="text-center text-sm text-gray-500 italic">
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

