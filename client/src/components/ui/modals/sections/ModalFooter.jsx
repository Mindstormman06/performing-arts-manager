export default function ModalFooter({ children, ...props }) {
    return (
        <h3
            className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4"
            {...props}
        >
            {children}
        </h3>
    )
}