export default function PageInput({ ...props }) {
	return (
		<input
			className={
				"w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			}
			{...props}
		/>
	);
}
