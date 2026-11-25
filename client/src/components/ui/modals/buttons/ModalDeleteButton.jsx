/**
 * A modal button styled as a red text action.
 *
 * @remarks
 * Stateless. Defaults to `type="button"` so it never submits a form unless the
 * caller overrides the type; all other props, including `onClick` and
 * `disabled`, pass through to the `<button>`, and a passed `className` replaces
 * the default styling.
 */
export default function ModalDeleteButton({ children, ...props }) {
	return (
		<button
			type="button"
			className={`cursor-pointer rounded-lg px-4 py-2 font-medium text-red-600 transition hover:text-red-800`}
			{...props}
		>
			{children}
		</button>
	);
}
