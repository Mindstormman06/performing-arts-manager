export default function ModalSubmitButton({ children, ...props }) {
    return (
        <button
            type="button"
            className={`rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50`}
            {...props}
        >
            {children}
        </button>
    )
}