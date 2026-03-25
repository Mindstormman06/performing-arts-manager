import { useRef } from "react";
import ModalLabel from "../text/ModalLabel.jsx";

export default function ModalImageInput({
	id,
	label,
	onChange,
	onPreview,
	previewUrl,
	...props
}) {
	const fileInputRef = useRef(null);

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			onChange(file);
			// Create preview URL
			const reader = new FileReader();
			reader.onloadend = () => {
				onPreview?.(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveImage = () => {
		onChange(null);
		onPreview?.(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div {...props}>
			{label && <ModalLabel htmlFor={id}>{label}</ModalLabel>}
			<div className="flex flex-col gap-4">
				<input
					ref={fileInputRef}
					id={id}
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="block w-full text-sm text-gray-500 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
				/>
				{previewUrl && (
					<div className="relative inline-block max-w-xs">
						<img
							src={previewUrl}
							alt="Preview"
							className="max-h-48 rounded-lg border border-gray-200 object-cover"
						/>
						<button
							type="button"
							onClick={handleRemoveImage}
							className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
						>
							✕
						</button>
					</div>
				)}
			</div>
		</div>
	);
}


