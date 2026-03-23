import { useState } from "react";
import { inviteByEmail, inviteUserToShow } from "../services/api";
import {
	ModalWrapper,
	ModalLabel,
	ModalInput,
	ModalError,
	ModalSubmitButton,
	ModalCancelButton,
	ModalSubHeader,
	ModalSubWrapper
} from "./ui/modals";

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

	const handleInvite = async (e) => {
		e.preventDefault();
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
			alert("Invitation sent successfully!");
		} catch (err) {
			setError(err.response?.data?.message || "Failed to send invitation");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalSubHeader>Invite New Member</ModalSubHeader>
				{error && <ModalError>{error}</ModalError>}
				<form onSubmit={handleInvite}>
					<div className="mb-4">
						<ModalLabel>Email Address</ModalLabel>
						<ModalInput
							type="email"
							placeholder="user@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="flex justify-end space-x-3">
						<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
						<ModalSubmitButton type="submit" disabled={loading}>
							{loading ? "Sending..." : "Send Invite"}
						</ModalSubmitButton>
					</div>
				</form>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
