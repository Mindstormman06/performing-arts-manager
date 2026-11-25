/**
 * A full-width styled text input for use inside modals.
 *
 * @remarks
 * Stateless; every prop, including `value`, `onChange` and `type`, is passed to
 * the `<input>`, and a passed `className` replaces the default styling.
 */
export default function ModalInput({ ...props }) {
	return (
		<input
			className={
				"mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			}
			{...props}
		/>
	);
}
