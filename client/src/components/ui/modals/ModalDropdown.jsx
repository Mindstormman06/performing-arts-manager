export default function ModalDropdown({ children, ...props }) {
	return (
		<select
			className={
				"mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			}
			{...props}
		>
			{children}
		</select>
	);
}
