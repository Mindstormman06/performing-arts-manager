export default function ModalSubWrapper({ children, ...props }) {
    return (
        <div { ...props } className="grid max-h-48 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
            { children }
        </div>
    )
}