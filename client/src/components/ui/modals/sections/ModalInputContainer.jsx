export default function ModalInputContainer({ children, columns, ...props }) {
	return (
		<div className={`grid gap-4 sm:grid-cols-${columns}`} {...props}>
			{children}
		</div>
	);
}
