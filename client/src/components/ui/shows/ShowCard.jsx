import { Link, useParams } from "react-router-dom";

/**
 * A clickable card summarising a show with its title and date range.
 *
 * @remarks
 * Stateless. Links to `/orgs/:orgId/shows/:showId`, taking `orgId` from the
 * current route params, and formats the show's start and end dates in the
 * browser locale. Must be rendered under a React Router route that has an
 * `orgId` param.
 */
export default function ShowCard({ show }) {
	const { orgId } = useParams();
	const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

	return (
		<Link
			to={`/orgs/${orgId}/shows/${show.id}`}
			className="block cursor-pointer rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<h3 className="font-bold text-gray-900 text-lg">{show.title}</h3>
			<p className="mt-1 text-gray-500 text-sm">
				{formatDate(show.start_date)} - {formatDate(show.end_date)}
			</p>
		</Link>
	);
}
