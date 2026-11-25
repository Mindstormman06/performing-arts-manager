/**
 * The `<form>` that holds a modal's fields, with vertical spacing between them.
 *
 * @remarks
 * Stateless. Disables native browser validation with `noValidate`, so modals
 * validate in their own handlers. The spacing size becomes a `space-y-N` class
 * built at runtime, so only sizes Tailwind already generates take effect. Other
 * props pass to the `<form>`.
 */
export default function ModalInputParent({ children, size = 3, ...props }) {
	return (
		<form {...props} className={`space-y-${size}`} noValidate>
			{children}
		</form>
	);
}
