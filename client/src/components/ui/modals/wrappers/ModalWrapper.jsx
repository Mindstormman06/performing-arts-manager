export default function ModalWrapper({ children, ...props }) {
	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4`}
			{...props}
		>
			{children}
		</div>
	);
}
