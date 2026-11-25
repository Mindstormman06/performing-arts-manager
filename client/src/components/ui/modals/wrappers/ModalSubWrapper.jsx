/**
 * The white modal panel that sits inside `ModalWrapper`.
 *
 * @remarks
 * Stateless; a column-flex card capped at 90% of the viewport height so
 * `ModalBody` can scroll. A passed `className` replaces the default styling.
 */
export default function ModalSubWrapper({ children, ...props }) {
	return (
		<div
			className={`flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl`}
			{...props}
		>
			{children}
		</div>
	);
}
