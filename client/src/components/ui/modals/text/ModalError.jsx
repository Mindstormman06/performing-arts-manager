/**
 * A red error message box for modals.
 *
 * @remarks
 * Stateless; shows `children` as the message. A passed `className` replaces the
 * default styling and other props pass to the `<div>`.
 */
export default function ModalError({ children, ...props }) {
	return (
		<div
			className={`mb-4 rounded bg-red-50 p-3 text-red-600 text-sm`}
			{...props}
		>
			{children}
		</div>
	);
}
