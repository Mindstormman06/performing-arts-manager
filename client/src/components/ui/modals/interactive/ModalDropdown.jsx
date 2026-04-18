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
