export default function ModalLabel({ children, htmlFor }) {
    return (
        <label
            htmlFor={htmlFor}
            className="mb-1 block text-sm font-medium text-gray-700"
        >
            {children}
        </label>
    )
}