export default function ModalNav({ children, ...props }) {
	return (
		<div {...props} className="mb-4 flex border-gray-200 border-b">
			{children}
		</div>
	);
}
