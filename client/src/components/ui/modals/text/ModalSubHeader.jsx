export default function ModalSubHeader({ children, ...props }) {
    return (
        <h3
            className="mb-3 font-semibold text-gray-800"
            {...props}
        >
            {children}
        </h3>
    )
}