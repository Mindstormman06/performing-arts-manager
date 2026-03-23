export default function ModalTextarea({ ...props }) {
	return (
		<textarea
			className="w-full rounded-lg mb-4 border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			{...props}
		/>
	);
}

