import { useState } from "react";
import { inviteByEmail } from "../services/api";

export default function InviteMemberModal({
	isOpen,
	onClose,
	orgId,
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
			await inviteByEmail(orgId, email);
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
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
		>
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
				<h3 className="mb-4 font-bold text-lg">Invite New Member</h3>
				{error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
				<form onSubmit={handleInvite}>
					<input
						type="email"
						placeholder="user@example.com"
						className="mb-4 w-full rounded border p-2 outline-none focus:ring-2 focus:ring-blue-500"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
						>
							{loading ? "Sending..." : "Send Invite"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
