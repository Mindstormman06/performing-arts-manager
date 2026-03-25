export default function ModalCancelButton({ children, ...props }) {
    return (
        <button
            type="button"
            className={`cursor-pointer rounded-lg px-4 py-2 font-medium text-gray-600 transition hover:bg-gray-100`}
            {...props}
        >
            {children}
        </button>
    )
}