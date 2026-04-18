export default function ModalHyperButton({ children, ...props }) {
	return (
		<button
			type="button"
			className={`cursor-pointer rounded-lg px-4 py-2 font-medium text-blue-600 transition hover:text-blue-800`}
			{...props}
		>
			{children}
		</button>
	);
}
