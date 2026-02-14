import { useEffect, useState } from "react";
import { updateOrganization } from "../services/api";

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
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
				<h3 className="mb-4 font-bold text-lg">Edit Organization</h3>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						className="mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-600"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							{loading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
