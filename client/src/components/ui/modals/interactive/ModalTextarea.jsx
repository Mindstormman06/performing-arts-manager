/**
 * A full-width styled multi-line text input for use inside modals.
 *
 * @remarks
 * Stateless; every prop, including `value`, `onChange` and `rows`, is passed to
 * the `<textarea>`, and a passed `className` replaces the default styling.
 */
export default function ModalTextarea({ ...props }) {
	return (
		<textarea
			className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			{...props}
		/>
	);
}
