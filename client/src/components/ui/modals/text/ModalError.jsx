export default function ModalError({ children, ...props }) {
	return (
		<div
			className={`mb-4 rounded bg-red-50 p-3 text-red-600 text-sm`}
			{...props}
		>
			{children}
		</div>
	);
}
