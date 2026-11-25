/**
 * A styled checkbox input for use inside modals.
 *
 * @remarks
 * Stateless; every prop, including `checked` and `onChange`, is passed to the
 * `<input type="checkbox">`, and a passed `className` replaces the default
 * styling. Usually wrapped in a `ModalLabel` with the `checkbox` variant.
 */
export default function ModalCheckbox({ ...props }) {
	return (
		<input
			type={"checkbox"}
			className={"h-4 w-4 rounded text-blue-600"}
			{...props}
		/>
	);
}
