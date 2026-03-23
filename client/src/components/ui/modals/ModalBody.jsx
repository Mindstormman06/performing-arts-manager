export default function ModalSubWrapper({ children, ...props }) {
    return (
        <div { ...props } className="flex-1 overflow-y-auto">
            { children }
        </div>
    )
}