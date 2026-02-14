import { useState } from "react";
import { createOrganization } from "../services/api";

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
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
				<h3 className="mb-4 font-bold text-lg">Create New Organization</h3>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Organization Name (e.g., VIU Theatre)"
						className="mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-800"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
						>
							{loading ? "Creating..." : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
