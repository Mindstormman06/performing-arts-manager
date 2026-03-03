export const IconButton = ({ onClick, title, customColour, icon = "+", colour = "blue", type = "button", shape = "circle", classes="", size="sm"}) => {
    const colours = {
        custom: customColour,
        blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
        red: "bg-red-100 text-red-600 hover:bg-red-200",
    };
    const shapes = {
        circle: "rounded-full",
        square: "rounded-lg",
    };
    const sizes = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        p2: "p-2",
        p3: "p-3",
        p4: "p-4",
    };

    return (
        <button 
            type={type}
            onClick={onClick}
            title={title}
            className={`flex ${sizes[size]} cursor-pointer items-center justify-center pb-1 font-bold text-xl transition-colors ${shapes[shape]} ${colours[colour]} ${classes}`}
        >
            {icon}
        </button>
    )
}