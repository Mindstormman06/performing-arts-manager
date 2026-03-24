import { useState } from "react";
import { createOrganization } from "../services/api";
import {
	ModalWrapper,
	ModalSubWrapper,
	ModalHeader,
	ModalLabel,
	ModalInput,
	ModalSubmitButton,
	ModalCancelButton,
	ModalError,
	ModalBody,
	ModalFooter,
	ModalInputContainer,
	ModalInputParent,
} from "./ui/modals";

export default function CreateOrgModal({ isOpen, onClose, onSuccess }) {
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleCreateOrg = async () => {
		if (!name.trim()) {
			setError("Please enter an organization name.");
			return;
		}

		setError("");
		setLoading(true);

		try {
			await createOrganization({ name });
			setName("");
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create organization");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Create New Organization</ModalHeader>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					<ModalInputParent>
						<ModalInputContainer>
							<ModalLabel htmlFor="create-org-name">Organization Name</ModalLabel>
							<ModalInput
								id="create-org-name"
								type="text"
								placeholder="Organization Name (e.g., VIU Theatre)"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</ModalInputContainer>
					</ModalInputParent>
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
					<ModalSubmitButton type="button" onClick={handleCreateOrg} disabled={loading}>
						{loading ? "Creating..." : "Create"}
					</ModalSubmitButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
