import { useState } from 'react';
import { updateOrganizationUserRoles } from '../services/api';

export default function RoleModal({ isOpen, onClose, onSuccess, orgId, user }) {
    // List of roles available in your system
    const availableRoles = ['admin', 'board-member', 'costumes', 'props', 'sets', 'tech'];
    const [selectedRoles, setSelectedRoles] = useState(
        () => user?.assignedRoles?.map(r => r.name) || []);

    if (!isOpen) return null;

    const handleToggle = (role) => {
        setSelectedRoles(prev => 
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handleSave = async () => {
        try {
            const hiddenRoles = user?.assignedRoles
                ?.map(r => r.name)
                .filter(name => !availableRoles.includes(name)) || [];

            const finalRoles = [...new Set([...selectedRoles, ...hiddenRoles])];

            await updateOrganizationUserRoles(orgId, user.users_id, finalRoles);
            onSuccess();
            onClose();
        } catch (err) {
            alert(`Failed to update roles: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                <h3 className="font-bold mb-4">Manage Roles for {user.User.fname}</h3>
                <div className="space-y-2 mb-6">
                    {availableRoles.map(role => (
                        <label key={role} className="flex items-center space-x-2 capitalize">
                            <input 
                                type="checkbox" 
                                checked={selectedRoles.includes(role)}
                                onChange={() => handleToggle(role)}
                                className="form-checkbox h-5 w-5 text-blue-600 cursor-pointer"
                            />
                            <span>{role}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} type="button" className="text-gray-500 hover:text-gray-700 cursor-pointer">Cancel</button>
                    <button onClick={handleSave} type="button" className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );
}