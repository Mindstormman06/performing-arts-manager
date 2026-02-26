import { IconButton } from "./IconButton";

export default function DashboardSection({ 
    title, 
    onActionClick, 
    actionTitle, 
    buttonColour = "blue",
    isTitleClickable = false,
    onTitleClick = null,
    className = "flex-1",
    children 
}) {
    return (
        <section className={`flex flex-col ${className}`}>
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
                <IconButton
                    onClick={onActionClick}
                    title={actionTitle}
                    colour={buttonColour}
                    shape="circle"
                />
            </div>

            {/* Content Container */}
            <div className="min-h-75 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-6">
                {children}
            </div>
        </section>
    );
}