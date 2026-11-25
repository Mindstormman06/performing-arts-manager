// Full class names so Tailwind's scanner can find them.
const SPACING_CLASSES = {
	1: "space-y-1",
	2: "space-y-2",
	3: "space-y-3",
	4: "space-y-4",
	5: "space-y-5",
	6: "space-y-6",
};

/**
 * The `<form>` that holds a modal's fields, with vertical spacing between them.
 *
 * @remarks
 * Stateless. Disables native browser validation with `noValidate`, so modals
 * validate in their own handlers. `size` (1-6, default 3) sets the vertical
 * spacing between fields. Other props pass to the `<form>`.
 */
export default function ModalInputParent({ children, size = 3, ...props }) {
	return (
		<form
			{...props}
			className={SPACING_CLASSES[size] ?? "space-y-3"}
			noValidate
		>
			{children}
		</form>
	);
}
