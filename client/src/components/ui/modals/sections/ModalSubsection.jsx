/**
 * A bordered, padded box that groups related content inside a modal.
 *
 * @remarks
 * Stateless; a passed `className` replaces the default styling and other props
 * pass to the `<div>`.
 */
export default function ModalSubsection({ children, ...props }) {
	return (
		<div className={`rounded-lg border border-gray-200 p-4`} {...props}>
			{children}
		</div>
	);
}
