export default function ModalHeader({ children, ...props }) {
	return (
		<div className="mb-4 flex items-center justify-between">
			<h2 className="font-bold text-2xl text-gray-800">{children}</h2>
			<button
				{...props}
				className="cursor-pointer font-bold text-gray-400 text-xl hover:text-gray-600"
			>
				&times;
			</button>
		</div>
	);
}
