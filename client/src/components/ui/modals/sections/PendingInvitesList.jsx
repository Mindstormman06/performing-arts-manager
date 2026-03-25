import ModalDeleteButton from "../buttons/ModalDeleteButton.jsx";
import ModalSubHeader from "../text/ModalSubHeader.jsx";
import ModalSubsection from "./ModalSubsection.jsx";

export default function PendingInvitesList({
	pendingMembers,
	onRescind,
}) {
	if (!pendingMembers || pendingMembers.length === 0) {
		return null;
	}

	return (
		<div className="mt-8">
			<ModalSubHeader className="mb-4">
				Pending Invitations
			</ModalSubHeader>
			<ModalSubsection>
				<div className="grid gap-3 sm:gap-4">
					{pendingMembers.map((member) => (
						<div
							key={member.assignment_id}
							className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
						>
							<div className="flex-1">
								<p className="font-medium text-gray-900">
									{member.User?.email}
								</p>
								<p className="text-xs text-gray-500">
									Awaiting acceptance
								</p>
							</div>
							<ModalDeleteButton
								type="button"
								onClick={() => onRescind(member.users_id)}
								className="ml-4"
							>
								Rescind
							</ModalDeleteButton>
						</div>
					))}
				</div>
			</ModalSubsection>
		</div>
	);
}

