import { useEffect, useState } from "react";
import { updateOrganization } from "../services/api";
import { ModalWrapper, ModalSubWrapper, ModalLabel, ModalInput, ModalSubmitButton, ModalCancelButton } from "./ui/modals";

export default function EditOrgModal({ isOpen, onClose, onSuccess, org }) {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (org) setName(org.name);
	}, [org]);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await updateOrganization(org.id, { name }); //
			onSuccess();
			onClose();
		} catch (err) {
			alert(err.response?.data?.message || "Update failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<h3 className="mb-4 font-bold text-lg">Edit Organization</h3>
				<form onSubmit={handleSubmit}>

					<ModalLabel>Organization Name</ModalLabel>
					<ModalInput
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>

					<div className="flex justify-end space-x-3">
						<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
						<ModalSubmitButton type="submit" disabled={loading}>
							{loading ? "Saving..." : "Save Changes"}
						</ModalSubmitButton>
					</div>
				</form>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
