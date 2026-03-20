import { useState, useEffect } from "react";
import { updateShowUserRoles } from "../services/api";

export default function ShowRoleModal({ isOpen, onClose, onSuccess, showId, user }) {
    const [loading, setLoading] = useState(false);

    const availableRoles = ["director", "stage-manager", "actor", "costumes", "props", "sets", "tech"];

    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        if (isOpen && user) {
            setSelectedRoles(user.assignedRoles?.map((r) => r.name) || []);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleToggle = (role) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const hiddenRoles = user?.assignedRoles?.map((r) => r.name).filter((name) => !availableRoles.includes(name)) || [];

            const finalRoles = [...new Set([...selectedRoles, ...hiddenRoles])];

            await updateShowUserRoles(showId, user.users_id, finalRoles);
            onSuccess();
            onClose();
        } catch (err) {
            alert(`Failed to update roles: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };
    

    return (
		<div className="fixed inset-0 z-60 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
			<div className="w-80 rounded-lg bg-white p-6 shadow-xl">
				<h3 className="mb-4 font-bold">Manage Roles for {user.User?.fname}</h3>
				<div className="mb-6 space-y-2">
					{availableRoles.map((role) => (
						<label key={role} className="flex items-center space-x-2 capitalize">
							<input
								type="checkbox"
								checked={selectedRoles.includes(role)}
								onChange={() => handleToggle(role)}
								className="form-checkbox h-5 w-5 cursor-pointer text-blue-600"
							/>
							<span>{role}</span>
						</label>
					))}
				</div>
				<div className="flex justify-end gap-2">
					<button onClick={onClose} disabled={loading} className="rounded px-4 py-2 text-gray-600 hover:bg-gray-100">Cancel</button>
					<button onClick={handleSave} disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
						{loading ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</div>
	);
}