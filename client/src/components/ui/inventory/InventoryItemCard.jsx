import InventoryPhotoCell from "../InventoryPhotoCell.jsx";

export default function InventoryItemCard({
	item,
	title,
	description,
	badges,
	footer,
	actions,
	className = "",
}) {
	return (
		<article
			className={`flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md ${className}`}
		>
			<div className="flex items-start gap-4">
				<div className="shrink-0">
					<InventoryPhotoCell
						photoPath={item.photo_path}
						itemName={title}
					/>
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
						<div className="min-w-0">
							<h3 className="truncate font-bold text-gray-900 text-lg">
								{title}
							</h3>
							{description && (
								<p className="mt-1 text-sm leading-6 text-gray-600">
									{description}
								</p>
							)}
						</div>

						{badges ? (
							<div className="flex flex-wrap items-center gap-2 sm:justify-end">
								{badges}
							</div>
						) : null}
					</div>

					{footer ? (
						<div className="mt-4 flex flex-wrap items-center gap-2">
							{footer}
						</div>
					) : null}
				</div>
			</div>

			{actions ? (
				<div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-4">
					{actions}
				</div>
			) : null}
		</article>
	);
}

