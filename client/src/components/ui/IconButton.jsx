export const IconButton = ({ onClick, title, icon = "+", colour = "blue", type = "button" }) => {
    const colours = {
        blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
        red: "bg-red-100 text-red-600 hover:bg-red-200",
    };

    return (
        <button 
            type={type}
            onClick={onClick}
            title={title}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full pb-1 font-bold text-xl transition-colors ${colours[colour]}`}
        >
            {icon}
        </button>
    )
}