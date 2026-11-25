/**
 * A responsive grid of checkbox items with a capped, scrollable height.
 *
 * @remarks
 * Stateless; lays children out in one column, or two from the `sm` breakpoint,
 * and scrolls once it passes `max-h-48`. Other props pass to the `<div>`, but
 * its class is fixed.
 */
export default function ModalBox({ children, ...props }) {
	return (
		<div
			{...props}
			className="grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2"
		>
			{children}
		</div>
	);
}
