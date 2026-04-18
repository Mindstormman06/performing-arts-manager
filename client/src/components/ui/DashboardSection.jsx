import { IconButton } from "./IconButton";

export default function DashboardSection({ 
    title, 
    onActionClick, 
    actionTitle, 
    buttonColour = "blue",
    buttonIcon = "+",
    isTitleClickable = false,
    onTitleClick = null,
    className = "flex-1",
    style,
    children
}) {
    const shouldShowActionButton = Boolean(actionTitle) && typeof onActionClick === "function";

    return (
        <section className={`flex flex-col ${className}`} style={style}>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-2xl text-gray-800">
                    {isTitleClickable ? (
                        <button
                            type="button"
                            className="cursor-pointer rounded outline-none transition-colors hover:text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500"
                            onClick={onTitleClick}
                        >
                            {title}
                        </button>
                    ) : (
                        title
                    )}
                </h2>
                {shouldShowActionButton && (
                    <IconButton
                        onClick={onActionClick}
                        title={actionTitle}
                        colour={buttonColour}
                        shape="circle"
                        icon={buttonIcon}
                    />
                )}
            </div>

            {/* Content Container */}
                  <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-6">
                {children}
            </div>
        </section>
    );
}