/**
 * The tab bar of a modal that holds `ModalNavItem` buttons.
 *
 * @remarks
 * Stateless; draws a bottom border under its children. Other props pass to the
 * `<div>`, but its class is fixed.
 */
export default function ModalNav({ children, ...props }) {
	return (
		<div {...props} className="mb-4 flex border-gray-200 border-b">
			{children}
		</div>
	);
}
