export default function ModalSubWrapper({ children, ...props }) {
    return (
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{ children }</h2>
            <button { ...props } className="text-xl font-bold text-gray-400 hover:text-gray-600">&times;</button>
        </div>
    )
}