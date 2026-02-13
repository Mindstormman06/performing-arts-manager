import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizations, deleteOrganization } from '../services/api';
import CreateOrgModal from '../components/CreateOrgModal';
import EditOrgModal from '../components/EditOrgModal';

export default function OrgDashboard() {
    const [organizations, setOrganizations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchOrganizations = async () => {
        try {
            const { data } = await getOrganizations();
            setOrganizations(data);
        } catch (err) {
            console.error('Failed to fetch organizations:', err);
        }
    };

    const handleDelete = async (orgId) => {
        if (window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
            try {
                await deleteOrganization(orgId);
                fetchOrganizations();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete organization');
            }
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            {/* THE MODAL COMPONENT - Rendered at root level for proper overlay */}
            <CreateOrgModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={fetchOrganizations} 
            />
            <EditOrgModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchOrganizations}
                org={selectedOrg}
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Your Organizations</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                    >
                        + New Organization
                    </button>
                </header>

                <div className="space-y-4">
                    {organizations.length > 0 ? (
                        organizations.map(org => (
                            <div key={org.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-800">{org.name}</h3>
                                    <div className="flex items-center space-x-3">
                                        <button 
                                            onClick={() => navigate(`/organizations/${org.id}/shows`)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer"
                                        >
                                            View Shows
                                        </button>
                                        <button 
                                            onClick={() => { setSelectedOrg(org); setIsEditModalOpen(true); }}
                                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition duration-200 cursor-pointer flex items-center space-x-1"
                                        >
                                            <span>✏️</span>
                                            <span>Edit</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(org.id)}
                                            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition duration-200 cursor-pointer flex items-center space-x-1"
                                        >
                                            <span>🗑️</span>
                                            <span>Delete</span>
                                        </button>
                                    </div>
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