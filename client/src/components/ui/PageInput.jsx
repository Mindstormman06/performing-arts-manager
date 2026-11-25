/**
 * A full-width text input styled for regular pages rather than modals.
 *
 * @remarks
 * Stateless and uncontrolled by itself: every prop, including `value` and
 * `onChange`, is passed straight to the `<input>`, and a passed `className`
 * replaces the default styling.
 */
export default function PageInput({ ...props }) {
	return (
		<input
			className={
				"w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			}
			{...props}
		/>
	);
}
