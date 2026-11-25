/**
 * A small section heading inside a modal.
 *
 * @remarks
 * Stateless; renders an `<h3>`. A passed `className` replaces the default
 * styling and other props pass through.
 */
export default function ModalSubHeader({ children, ...props }) {
	return (
		<h3 className="mb-3 font-semibold text-gray-800" {...props}>
			{children}
		</h3>
	);
}
