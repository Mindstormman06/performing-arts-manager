export default function ModalSubsection({ children, ...props }) {
	return (
		<div className={`rounded-lg border border-gray-200 p-4`} {...props}>
			{children}
		</div>
	);
}
