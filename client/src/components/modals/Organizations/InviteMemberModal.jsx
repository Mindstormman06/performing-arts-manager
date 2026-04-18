import { useState } from "react";
import { inviteByEmail, inviteUserToShow } from "../../../services/api.js";
import {
	ModalBody,
	ModalCancelButton,
	ModalError,
	ModalFooter,
	ModalHeader,
	ModalInput,
	ModalInputContainer,
	ModalInputParent,
	ModalLabel,
	ModalSubmitButton,
	ModalSubWrapper,
	ModalWrapper,
} from "../../ui/modals/index.js";

export default function InviteMemberModal({
	isOpen,
	onClose,
	orgId,
	showId,
	onSuccess,
}) {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleInvite = async () => {
		if (!email.trim()) {
			setError("Please enter an email address.");
			return;
		}

		setError("");
		setLoading(true);
		try {
			if (showId) {
				await inviteUserToShow(showId, { orgId, email });
			} else {
				await inviteByEmail(orgId, email);
			}
			setEmail("");
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to send invitation");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Invite New Member</ModalHeader>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					<ModalInputParent>
						<ModalInputContainer>
							<ModalLabel htmlFor="invite-member-email">
								Email Address
							</ModalLabel>
							<ModalInput
								id="invite-member-email"
								type="email"
								placeholder="user@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</ModalInputContainer>
					</ModalInputParent>
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
					<ModalSubmitButton
						type="button"
						onClick={handleInvite}
						disabled={loading}
					>
						{loading ? "Sending..." : "Send Invite"}
					</ModalSubmitButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
