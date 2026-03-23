export default function ModalSubWrapper({ children, ...props }) {
    return (
        <div { ...props } className="mb-4 flex border-b border-gray-200">
            { children }
        </div>
    )
}