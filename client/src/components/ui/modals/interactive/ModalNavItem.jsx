/**
 * A tab button for a modal's tab bar.
 *
 * @remarks
 * Stateless; the parent says whether this tab is active, which underlines it in
 * blue. Other props pass to the `<button>`, but the styling cannot be
 * overridden. Meant to sit inside `ModalNav`.
 */
export default function ModalNavItem({ children, isActive, ...props }) {
	return (
		<button
			{...props}
			className={`px-4 py-2 font-medium transition-colors ${isActive ? "border-blue-600 border-b-2 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
		>
			{children}
		</button>
	);
}
