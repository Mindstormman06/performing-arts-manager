import { useState } from "react";
import { createShow } from "../../../services/api.js";
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

export default function CreateShowModal({ isOpen, onClose, onSuccess, orgId }) {
	const [title, setTitle] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleCreateShow = async () => {
		if (!title.trim() || !startDate || !endDate) {
			setError("Please fill in all required fields.");
			return;
		}

		const start = new Date(startDate);
		const end = new Date(endDate);

		if (end < start) {
			setError("End date must be after start date.");
			return;
		}

		setError("");
		setLoading(true);

		try {
			await createShow({
				title: title,
				start_date: startDate,
				end_date: endDate,
				organization_id: orgId,
			});
			setTitle("");
			setStartDate("");
			setEndDate("");
			onSuccess();
			onClose();
		} catch (err) {
			setError(err.response?.data?.message || "Failed to create show");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<ModalHeader onClick={onClose}>Create New Show</ModalHeader>

				{error && <ModalError>{error}</ModalError>}

				<ModalBody>
					<ModalInputParent>
						<ModalInputContainer>
							<ModalLabel htmlFor="create-show-title">Show Title</ModalLabel>
							<ModalInput
								id="create-show-title"
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								placeholder="e.g. The Phantom of the Opera"
							/>
						</ModalInputContainer>

						<ModalInputContainer columns={2}>
							<div>
								<ModalLabel htmlFor="create-show-start-date">
									Start Date
								</ModalLabel>
								<ModalInput
									id="create-show-start-date"
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									required
								/>
							</div>
							<div>
								<ModalLabel htmlFor="create-show-end-date">End Date</ModalLabel>
								<ModalInput
									id="create-show-end-date"
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									required
								/>
							</div>
						</ModalInputContainer>
					</ModalInputParent>
				</ModalBody>

				<ModalFooter>
					<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
					<ModalSubmitButton
						type="button"
						onClick={handleCreateShow}
						disabled={loading}
					>
						{loading ? "Creating..." : "Create Show"}
					</ModalSubmitButton>
				</ModalFooter>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}
