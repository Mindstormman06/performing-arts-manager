import { useState } from "react";
import { createOrganization } from "../services/api";
import { ModalWrapper, ModalSubWrapper, ModalLabel, ModalInput, ModalSubmitButton, ModalCancelButton } from "./ui/modals";

export default function CreateOrgModal({ isOpen, onClose, onSuccess }) {
	const [name, setName] = useState("");
	const [_error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
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
				<h3 className="mb-4 font-bold text-lg">Create New Organization</h3>
				<form onSubmit={handleSubmit}>
					<ModalLabel>Organization Name</ModalLabel>
					<ModalInput
						type="text"
						placeholder="Organization Name (e.g., VIU Theatre)"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<div className="flex justify-end space-x-3">
						<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
						<ModalSubmitButton type="submit" disabled={loading}>
							{loading ? "Creating..." : "Create"}
						</ModalSubmitButton>
					</div>
				</form>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
