/**
 * A grid wrapper that groups one or more form fields in a modal.
 *
 * @remarks
 * Stateless. A column count from the parent becomes a `sm:grid-cols-N` class
 * built at runtime, so that class only works if Tailwind already generates it
 * for some other reason. Other props pass to the `<div>`.
 */
export default function ModalInputContainer({ children, columns, ...props }) {
	return (
		<div className={`grid gap-4 sm:grid-cols-${columns}`} {...props}>
			{children}
		</div>
	);
}
