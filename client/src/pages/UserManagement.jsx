import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrganizationUsers, inviteByEmail, updateOrganizationUserRoles, removeUserFromOrganization } from '../services/api';
import RoleModal from '../components/OrgRoleModal';

export default function UserManagement() {
    const { orgId } = useParams();
    const [members, setMembers] = useState([]);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchMembers = async () => {
        try {
            const { data } = await getOrganizationUsers(orgId);
            setMembers(data);
        } catch (err) {
            console.error('Failed to fetch members:', err);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [orgId]);

    const handleInvite = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await inviteByEmail(orgId, email);
            setEmail('');
            fetchMembers();
            alert('Invitation sent successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send invitation');
        } finally {
            setLoading(false);
        }
    };

    const activeMembers = members.filter(m => m.status === 'active');
    const pendingMembers = members.filter(m => m.status === 'pending');

    return (
        <div className="max-w-5xl mx-auto p-6">
            <RoleModal 
                isOpen={isRoleModalOpen}
                user={selectedUser}
                orgId={orgId}
                onClose={() => setIsRoleModalOpen(false)}
                onSuccess={fetchMembers}
            />
            <h2 className="text-3xl font-bold mb-8">Manage Organization Users</h2>

            {/* Invite Form */}
            <section className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">Invite New Member</h3>
                <form onSubmit={handleInvite} className="flex gap-4">
                    <input 
                        type="email" placeholder="user@example.com"
                        className="flex-1 border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
                        value={email} onChange={(e) => setEmail(e.target.value)} required
                    />
                    <button 
                        type="submit" disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Sending...' : 'Send Invite'}
                    </button>
                </form>
            </section>

            {/* Active Members Grid */}
            <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Active Members</h3>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Grid Header */}
                    <div className="bg-gray-50 border-b p-4 grid grid-cols-12 gap-4 font-semibold text-gray-700">
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-4">Roles</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                    
                    {/* Grid Items */}
                    <div className="divide-y divide-gray-200">
                        {activeMembers.map(m => (
                            <div key={m.assignment_id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50">
                                <div className="col-span-3 font-medium">
                                    {m.User?.fname} {m.User?.lname}
                                </div>
                                <div className="col-span-3 text-gray-600">
                                    {m.User?.email}
                                </div>
                                <div className="col-span-4">
                                    <div className="flex flex-wrap gap-1">
                                        {m.assignedRoles?.map(role => (
                                            <span key={role.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                {role.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-span-2 flex justify-end space-x-3">
                                    <button 
                                        onClick={() => { setSelectedUser(m); setIsRoleModalOpen(true); }}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer transition-colors"
                                    >
                                        Edit Roles
                                    </button>
                                    <button 
                                        onClick={() => removeUserFromOrganization(orgId, m.users_id).then(fetchMembers)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pending Invites */}
            {pendingMembers.length > 0 && (
                <section>
                    <h3 className="text-xl font-semibold mb-4 text-orange-600">Pending Invitations</h3>
                    <div className="bg-white rounded-lg shadow">
                        {pendingMembers.map(m => (
                            <div key={m.assignment_id} className="p-4 border-b flex justify-between items-center">
                                <span>{m.User?.email}</span>
                                <button 
                                    onClick={() => removeUserFromOrganization(orgId, m.users_id).then(fetchMembers)}
                                    className="text-gray-500 hover:text-red-600 text-sm"
                                >
                                    Rescind
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}