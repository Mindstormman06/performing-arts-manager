import { useState } from "react";
import { createShow } from "../services/api";
import { ModalWrapper, ModalSubWrapper, ModalLabel, ModalInput, ModalSubmitButton, ModalCancelButton } from "./ui/modals";

export default function CreateShowModal({ isOpen, onClose, onSuccess, orgId }) {
	const [title, setTitle] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			// Sending both org_id (for the database) and orgId (in case auth middleware needs it)
			await createShow({
				title: title,
				start_date: startDate,
				end_date: endDate,
				organization_id: orgId,
			});
			setTitle("");
			setStartDate("");
			setEndDate("");
			onSuccess(); // Refresh the dashboard data
			onClose();
		} catch (err) {
			alert(err.response?.data?.message || "Failed to create show");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ModalWrapper>
			<ModalSubWrapper>
				<h3 className="mb-4 font-bold text-gray-900 text-lg">Create New Show</h3>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<ModalLabel>Show Title</ModalLabel>
						<ModalInput
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							placeholder="e.g. The Phantom of the Opera"
						/>
					</div>
					
					<div className="mb-6 grid grid-cols-2 gap-4">
						<div>
							<ModalLabel>Start Date</ModalLabel>
							<ModalInput
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								required
							/>
						</div>
						<div>
							<ModalLabel>End Date</ModalLabel>
							<ModalInput
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								required
							/>
						</div>
					</div>

					<div className="flex justify-end space-x-3">
						<ModalCancelButton onClick={onClose}>Cancel</ModalCancelButton>
						<ModalSubmitButton type="submit" disabled={loading}>
							{loading ? "Creating..." : "Create Show"}
						</ModalSubmitButton>
					</div>
				</form>
			</ModalSubWrapper>
		</ModalWrapper>
	);
}