/**
 * A styled `<select>` for use inside modals.
 *
 * @remarks
 * Stateless; options come from `children` and every other prop passes to the
 * `<select>`. Any `flex-` class in the caller's `className` swaps the default
 * full width for `min-w-0` so the dropdown can share a flex row.
 */
export default function ModalDropdown({ children, className = "", ...props }) {
	const baseClasses =
		"rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
	const hasFlexClass =
		className.includes("flex-1") || className.includes("flex-");
	const widthClass = hasFlexClass ? "min-w-0" : "w-full";
	const combinedClassName = `${widthClass} ${baseClasses} ${className}`.trim();

	return (
		<select className={combinedClassName} {...props}>
			{children}
		</select>
	);
}
