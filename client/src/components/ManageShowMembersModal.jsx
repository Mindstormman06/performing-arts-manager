import { useState, useEffect } from "react";
import { removeUserFromShow, addUserToShow, getOrganizationUsers } from "../services/api";
import ShowRoleModal from "./ShowRoleModal";
import InviteMemberModal from "./InviteMemberModal";

export default function ManageShowMembersModal({ isOpen, onClose, members, orgId, showId, onSuccess }) {
	const [orgMembers, setOrgMembers] = useState([]);
    const [selectedOrgUserId, setSelectedOrgUserId] = useState("");
    
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (isOpen) {
            getOrganizationUsers(orgId).then(res => setOrgMembers(res.data)).catch(console.error);
        }
    }, [isOpen, orgId]);

	if (!isOpen) return null;

	const handleRemove = async (userId) => {
		if (window.confirm("Are you sure you want to remove this user from the show?")) {
			try {
				await removeUserFromShow(showId, userId);
				onSuccess();
			} catch {
				alert("Failed to remove user");
			}
		}
	};

    const handleAddOrgMember = async () => {
        if (!selectedOrgUserId) return;
        try {
            await addUserToShow(showId, selectedOrgUserId);
            setSelectedOrgUserId("");
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add user");
        }
    };

    const showMemberIds = members.map(m => m.users_id);
    const availableOrgMembers = orgMembers.filter(m => !showMemberIds.includes(m.users_id) && m.status === 'active');

	return (
		<div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
			
            <ShowRoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} user={selectedUser} showId={showId} onSuccess={onSuccess} />
            <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} orgId={orgId} showId={showId} onSuccess={onSuccess} />

			<div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl relative">
				<div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-2xl text-gray-800">Manage Show Roster</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                {/* Add New Members Section */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex-1 flex gap-2 w-full">
                        <select 
                            value={selectedOrgUserId} 
                            onChange={(e) => setSelectedOrgUserId(e.target.value)}
                            className="flex-1 rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Add from Organization --</option>
                            {availableOrgMembers.map(m => (
                                <option key={m.users_id} value={m.users_id}>{m.User?.fname} {m.User?.lname} ({m.User?.email})</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleAddOrgMember}
                            disabled={!selectedOrgUserId}
                            className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    <div className="text-gray-400 font-medium hidden sm:block">OR</div>
                    <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                    >
                        + Invite via Email
                    </button>
                </div>

				{/* Current Roster Table */}
				<div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
					<table className="w-full text-left text-sm">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-4 font-bold text-gray-900">Name</th>
								<th className="px-6 py-4 font-bold text-gray-900">Email</th>
								<th className="px-6 py-4 font-bold text-gray-900">Roles</th>
								<th className="px-6 py-4 font-bold text-gray-900 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{members.map((m) => (
								<tr key={m.users_id} className="transition-colors hover:bg-gray-50">
									<td className="px-6 py-4 font-medium text-gray-900">
										{m.User?.fname} {m.User?.lname}
                                        {m.status === 'pending' && <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Pending</span>}
									</td>
									<td className="px-6 py-4 text-gray-500">{m.User?.email}</td>
									<td className="px-6 py-4 text-gray-500">
										<div className="flex flex-wrap gap-1">
											{m.assignedRoles?.map((role) => (
												<span key={role.id} className="rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs capitalize">
													{role.name}
												</span>
											))}
										</div>
									</td>
									<td className="flex justify-end space-x-3 p-4">
										<button
											type="button"
											onClick={() => { setSelectedUser(m); setIsRoleModalOpen(true); }}
											className="font-medium text-blue-600 hover:text-blue-800"
										>
											Edit Roles
										</button>
										<button
											type="button"
											onClick={() => handleRemove(m.users_id)}
											className="font-medium text-red-600 hover:text-red-800"
										>
											Remove
										</button>
									</td>
								</tr>
							))}
                            {members.length === 0 && (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-500 italic">No members in this show yet.</td></tr>
                            )}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}