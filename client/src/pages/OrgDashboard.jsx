import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizations, deleteOrganization, respondToInvite, getMyOrganizations } from '../services/api'; //
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
            const { data } = await getMyOrganizations(); //
            setOrganizations(data);
        } catch (err) {
            console.error('Failed to fetch organizations:', err);
        }
    };

    const handleDelete = async (orgId) => {
        if (window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
            try {
                await deleteOrganization(orgId); //
                fetchOrganizations();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete organization');
            }
        }
    };

    const handleInviteAction = async (orgId, action) => {
        try {
            // action is 'accept' or 'decline'
            await respondToInvite(orgId, action); 
            fetchOrganizations();
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Split organizations by status
    const activeOrgs = organizations.filter(o => o.status === 'active' || !o.status); 
    const pendingInvites = organizations.filter(o => o.status === 'pending');

    return (
        <div className="min-h-screen bg-gray-100 py-8">
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
                
                {/* 1. Pending Invitations Section */}
                {pendingInvites.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-orange-600 mb-4">Pending Invitations</h2>
                        <div className="space-y-4">
                            {pendingInvites.map(invite => (
                                <div key={invite.org_id} className="bg-orange-50 border border-orange-200 rounded-lg p-6 flex justify-between items-center shadow-sm">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {invite.Organization?.name || "Organization Invite"}
                                        </h3>
                                        <p className="text-sm text-gray-600">You've been invited to join.</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={() => handleInviteAction(invite.org_id, 'accept')}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleInviteAction(invite.org_id, 'decline')}
                                            className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50 cursor-pointer"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 2. Active Organizations Section */}
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
                    {activeOrgs.length > 0 ? (
                        activeOrgs.map(org => {
                            const orgData = org.Organization || org;
                            return (
                                <div key={orgData.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-semibold text-gray-800">{orgData.name}</h3>
                                        <div className="flex items-center space-x-3">
                                            <button 
                                                onClick={() => navigate(`/orgs/${orgData.id}/shows`)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
                                            >
                                                View Shows
                                            </button>
                                            {/* Extra Admin Actions: Users Button */}
                                            <button 
                                                onClick={() => navigate(`/orgs/${orgData.id}/users`)}
                                                className="bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-800 cursor-pointer"
                                            >
                                                👥
                                            </button>
                                            <button 
                                                onClick={() => { setSelectedOrg(orgData); setIsEditModalOpen(true); }}
                                                className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 cursor-pointer"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(orgData.id)}
                                                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-600 text-lg">No active organizations found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}