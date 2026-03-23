export default function ModalSubWrapper({ children, ...props }) {
    return (
        <div
            className={`w-full max-w-2xl flex flex-col max-h-[90vh] rounded-2xl bg-white p-6 shadow-xl`}
            {...props}
        >
            {children}
        </div>
    )
}