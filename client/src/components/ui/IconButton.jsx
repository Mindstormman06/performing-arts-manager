/**
 * A small square or round button that shows a single icon or glyph.
 *
 * @remarks
 * Stateless. The parent picks a colour preset (`blue`, `red`, or `custom` with
 * its own class string), a shape (`none`, `circle`, `square`), a size key
 * (fixed `sm`/`md`/`lg` or padding-based `p1_5` to `p4`), the button type, and
 * extra classes. The title doubles as the native tooltip. Exported as a named
 * export, not a default.
 */
export const IconButton = ({
	onClick,
	title,
	customColour,
	icon = "+",
	colour = "blue",
	type = "button",
	shape = "circle",
	classes = "",
	size = "sm",
}) => {
	const colours = {
		custom: customColour,
		blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
		red: "bg-red-100 text-red-600 hover:bg-red-200",
	};
	const shapes = {
		none: "",
		circle: "rounded-full",
		square: "rounded-lg",
	};
	const sizes = {
		sm: "h-8 w-8",
		md: "h-10 w-10",
		lg: "h-12 w-12",
		p1_5: "p-1.5",
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
	);
};
