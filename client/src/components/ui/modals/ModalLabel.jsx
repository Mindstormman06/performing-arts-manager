export default function ModalLabel({ children, htmlFor }) {
	return (
		<label
			htmlFor={htmlFor}
			className="mb-1 block font-medium text-gray-700 text-sm"
		>
			{children}
		</label>
	);
}
