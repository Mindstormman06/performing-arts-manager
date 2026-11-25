/**
 * The scrollable middle area of a modal.
 *
 * @remarks
 * Stateless; grows to fill the space between header and footer and scrolls
 * vertically. Other props pass to the `<div>`, but its class is fixed.
 */
export default function ModalBody({ children, ...props }) {
	return (
		<div {...props} className="flex-1 overflow-y-auto">
			{children}
		</div>
	);
}
