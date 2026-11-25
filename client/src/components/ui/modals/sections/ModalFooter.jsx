/**
 * The bottom action row of a modal, right-aligned with a top border.
 *
 * @remarks
 * Stateless; children are usually the cancel and submit buttons. Renders as an
 * `<h3>` element, and a passed `className` replaces the default styling.
 */
export default function ModalFooter({ children, ...props }) {
	return (
		<h3
			className="mt-6 flex items-center justify-end gap-3 border-gray-100 border-t pt-4"
			{...props}
		>
			{children}
		</h3>
	);
}
