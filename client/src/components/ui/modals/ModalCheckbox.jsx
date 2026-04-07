export default function ModalCheckbox({ ...props }) {
	return (
		<input
			type={"checkbox"}
			className={"h-4 w-4 rounded text-blue-600"}
			{...props}
		/>
	);
}
