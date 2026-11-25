// Full class names so Tailwind's scanner can find them.
const COLUMN_CLASSES = {
	1: "sm:grid-cols-1",
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-3",
	4: "sm:grid-cols-4",
};

/**
 * A grid wrapper that groups one or more form fields in a modal.
 *
 * @remarks
 * Stateless. `columns` (1-4) sets the column count from the `sm` breakpoint up;
 * without it the fields stack in one column. Other props pass to the `<div>`.
 */
export default function ModalInputContainer({ children, columns, ...props }) {
	return (
		<div className={`grid gap-4 ${COLUMN_CLASSES[columns] ?? ""}`} {...props}>
			{children}
		</div>
	);
}
