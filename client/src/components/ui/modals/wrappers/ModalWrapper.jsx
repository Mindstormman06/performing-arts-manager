/**
 * The fixed, full-screen dimmed backdrop that centres a modal.
 *
 * @remarks
 * Stateless; renders at `z-50` over the page and does not close on backdrop
 * click. Nested modals render another `ModalWrapper` inside it. A passed
 * `className` replaces the default styling.
 */
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
