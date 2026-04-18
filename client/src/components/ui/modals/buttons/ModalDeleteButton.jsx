export default function ModalDeleteButton({ children, ...props }) {
	return (
		<button
			type="button"
			className={`cursor-pointer rounded-lg px-4 py-2 font-medium text-red-600 transition hover:text-red-800`}
			{...props}
		>
			{children}
		</button>
	);
}
