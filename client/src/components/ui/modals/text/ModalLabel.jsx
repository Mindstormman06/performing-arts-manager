/**
 * A form label for modal fields, with a plain and a checkbox variant.
 *
 * @remarks
 * Stateless. The default variant is a small bold label above a field; the
 * `checkbox` variant is a clickable bordered row meant to wrap a
 * `ModalCheckbox` and its text. Extra classes are appended to the variant's
 * classes, and `htmlFor` ties it to its input.
 */
export default function ModalLabel({
	children,
	variant,
	className = "",
	htmlFor,
	...props
}) {
	return (
		<label
			htmlFor={htmlFor}
			{...props}
			className={`${
				variant === "checkbox"
					? "flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100"
					: "mb-1 block font-medium text-gray-700 text-sm"
			} ${className}`.trim()}
		>
			{children}
		</label>
	);
}
