import { useState } from "react";
import { BACKEND_URL } from "../../services/config.js";

export default function InventoryPhotoCell({ photoPath, itemName }) {
	const [showModal, setShowModal] = useState(false);

	if (!photoPath) {
		return (
			<div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-300 border-dashed bg-gray-50">
				<span className="text-2xl text-gray-400">📷</span>
			</div>
		);
	}

	const fullImageUrl = `${BACKEND_URL}${photoPath}`;

	return (
		<>
			<button
				type="button"
				onClick={() => setShowModal(true)}
				className="overflow-hidden rounded-lg border border-gray-200 transition-transform hover:scale-105"
			>
				<img
					src={fullImageUrl}
					alt={itemName}
					className="h-16 w-16 object-cover"
				/>
			</button>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="relative max-h-screen max-w-2xl">
						<button
							type="button"
							onClick={() => setShowModal(false)}
							className="absolute -top-4 -right-4 rounded-full bg-white p-2 text-gray-600 shadow-lg hover:text-gray-900"
						>
							✕
						</button>
						<img
							src={fullImageUrl}
							alt={itemName}
							className="max-h-screen rounded-lg object-contain"
						/>
						<p className="mt-4 text-center text-gray-600 text-sm">{itemName}</p>
					</div>
				</div>
			)}
		</>
	);
}
