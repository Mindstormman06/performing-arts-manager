import { useState } from "react";

export default function InventoryPhotoCell({ photoPath, itemName }) {
	const [showModal, setShowModal] = useState(false);

	if (!photoPath) {
		return (
			<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
				<span className="text-gray-400 text-lg">📷</span>
			</div>
		);
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setShowModal(true)}
				className="overflow-hidden rounded-lg border border-gray-200 transition-transform hover:scale-105"
			>
				<img
					src={photoPath}
					alt={itemName}
					className="h-12 w-12 object-cover"
				/>
			</button>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="relative max-h-screen max-w-2xl">
						<button
							type="button"
							onClick={() => setShowModal(false)}
							className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-gray-600 shadow-lg hover:text-gray-900"
						>
							✕
						</button>
						<img
							src={photoPath}
							alt={itemName}
							className="max-h-screen rounded-lg object-contain"
						/>
						<p className="mt-4 text-center text-sm text-gray-600">{itemName}</p>
					</div>
				</div>
			)}
		</>
	);
}

