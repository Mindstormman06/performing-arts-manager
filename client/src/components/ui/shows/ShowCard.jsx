export default function ShowCard({ show }) {
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    return (
        <div className="cursor-pointer rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
            <h3 className="font-bold text-gray-900 text-lg">
                {show.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                {formatDate(show.start_date)} - {formatDate(show.end_date)}
            </p>
        </div>
    );
}