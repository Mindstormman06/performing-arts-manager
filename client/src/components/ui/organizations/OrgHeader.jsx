import { IconButton } from "../IconButton";

export default function OrgHeader({ name, presidentName, onEdit, onDelete }) {
    return (
        <header className="flex items-start justify-between border-gray-200 border-b bg-gray-50 px-8 py-6">
            <div>
                <h1 className="font-extrabold text-5xl text-gray-900 tracking-tight">
                    {name || "Loading..."}
                </h1>
                <p className="mt-2 font-medium text-gray-500 text-lg">
                    President: <span className="text-gray-800">{presidentName}</span>
                </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
                <IconButton
                    onClick={onEdit}
                    title="Edit Organization"
                    colour="custom"
                    customColour="hover:bg-blue-50"
                    shape="square"
                    icon="✏️"
                    size="p2"
                />
                <IconButton
                    onClick={onDelete}
                    title="Delete Organization"
                    colour="custom"
                    customColour="hover:bg-red-50"
                    shape="square"
                    icon="🗑️"
                    size="p2"
                />
            </div>
        </header>
    );
}