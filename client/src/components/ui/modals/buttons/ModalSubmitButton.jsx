/**
 * A modal button styled as a solid blue action.
 *
 * @remarks
 * Stateless. Defaults to `type="button"` so it never submits a form unless the
 * caller overrides the type; all other props, including `onClick` and
 * `disabled`, pass through to the `<button>`, and a passed `className` replaces
 * the default styling.
 */
export default function ModalSubmitButton({ children, ...props }) {
	return (
		<button
			type="button"
			className={`cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50`}
			{...props}
		>
			{children}
		</button>
	);
}
