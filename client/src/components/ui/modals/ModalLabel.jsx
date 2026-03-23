export default function ModalLabel({ children, variant, ...props }) {
    return (
        <label
            { ...props }
            className={`${
                variant === 'checkbox'
                    ? 'flex cursor-pointer items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-gray-100'
                    : 'mb-1 block text-sm font-medium text-gray-700'
            }`}
        >
            {children}
        </label>
    )
}