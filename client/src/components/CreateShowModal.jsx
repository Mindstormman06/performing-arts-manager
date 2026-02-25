import { useState } from "react";
import { createShow } from "../services/api";

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
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
				<h3 className="mb-4 font-bold text-gray-900 text-lg">Create New Show</h3>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="mb-1 block font-medium text-gray-700 text-sm">
							Show Title
						</label>
						<input
							type="text"
							className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							placeholder="e.g. The Phantom of the Opera"
						/>
					</div>
					
					<div className="mb-6 grid grid-cols-2 gap-4">
						<div>
							<label className="mb-1 block font-medium text-gray-700 text-sm">
								Start Date
							</label>
							<input
								type="date"
								className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								required
							/>
						</div>
						<div>
							<label className="mb-1 block font-medium text-gray-700 text-sm">
								End Date
							</label>
							<input
								type="date"
								className="w-full rounded border border-gray-300 p-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								required
							/>
						</div>
					</div>

					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="cursor-pointer rounded px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
						>
							{loading ? "Creating..." : "Create Show"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}