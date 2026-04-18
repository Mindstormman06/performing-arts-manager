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
