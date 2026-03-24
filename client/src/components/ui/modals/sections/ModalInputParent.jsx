export default function ModalInputParent({ children, size = 3, ...props }) {
    return (
        <form { ...props } className={`space-y-${size}`} noValidate>
            { children }
        </form>
    )
}