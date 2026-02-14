import { useState, useEffect } from 'react';
import { getOrganizations } from '../services/api'

export default function OrgDashboard() {
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        const fetchOrgsanizations = async () => {
            try {
                const { data } = await getOrganizations();
                setOrganizations(data);
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };
        fetchOrgsanizations();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Your Organizations</h2>
                </header>

                <div className="space-y-4">
                    {organizations.length > 0 ? (
                        organizations.map(org => (
                            <div key={org.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-800">{org.name}</h3>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
                                        View Shows
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-600 text-lg">You aren't a member of any organizations yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}