import { useEffect, useState } from "react";
import { updateOrganization } from "../../../services/api.js";
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

export default function EditOrgModal({ isOpen, onClose, onSuccess, org }) {
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (org) setName(org.name);
	}, [org]);

	if (!isOpen) return null;

	const handleUpdateOrg = async () => {
		if (!name.trim()) {
			setError("Please enter an organizations name.");
			return;
		}

		setError("");
		setLoading(true);

		try {
			await updateOrganization(org.id, { name });
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Update failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Edit Organization</ModalHeader>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					<ModalInputParent>
						<ModalInputContainer>
							<ModalLabel htmlFor="edit-org-name">Organization Name</ModalLabel>
							<ModalInput
								id="edit-org-name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</ModalInputContainer>
					</ModalInputParent>
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
					<ModalSubmitButton
						type="button"
						onClick={handleUpdateOrg}
						disabled={loading}
					>
						{loading ? "Saving..." : "Save Changes"}
					</ModalSubmitButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
