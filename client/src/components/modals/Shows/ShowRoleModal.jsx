import { useState, useEffect } from "react";
import { updateShowUserRoles } from "../../../services/api.js";
import {
    ModalBody,
    ModalBox,
    ModalCancelButton,
    ModalCheckbox,
    ModalError,
    ModalFooter,
    ModalHeader,
    ModalLabel,
    ModalSubHeader,
    ModalSubsection,
    ModalSubmitButton,
    ModalSubWrapper,
    ModalWrapper
} from "../../ui/modals/index.js";

export default function ShowRoleModal({ isOpen, onClose, onSuccess, showId, user }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const availableRoles = ["director", "stage-manager", "actor", "costumes", "props", "sets", "tech"];

    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        if (isOpen && user) {
            setSelectedRoles(user.assignedRoles?.map((r) => r.name) || []);
            setError("");
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleToggle = (role) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const handleSave = async () => {
        setError("");
        setLoading(true);

        try {
            const hiddenRoles = user?.assignedRoles?.map((r) => r.name).filter((name) => !availableRoles.includes(name)) || [];

            const finalRoles = [...new Set([...selectedRoles, ...hiddenRoles])];

            await updateShowUserRoles(showId, user.users_id, finalRoles);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update roles");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper>
            <ModalSubWrapper>
                <ModalHeader onClick={onClose}>Manage Roles for {user.User?.fname}</ModalHeader>

                {error && <ModalError>{error}</ModalError>}

                <ModalBody>
                    <ModalSubsection>
                        <ModalSubHeader>Available Roles</ModalSubHeader>
                        <ModalBox>
                            {availableRoles.map((role) => (
                                <ModalLabel key={role} variant="checkbox">
                                    <ModalCheckbox
                                        checked={selectedRoles.includes(role)}
                                        onChange={() => handleToggle(role)}
                                    />
                                    <span className="capitalize">{role}</span>
                                </ModalLabel>
                            ))}
                        </ModalBox>
                    </ModalSubsection>
                </ModalBody>

                <ModalFooter>
                    <ModalCancelButton onClick={onClose} disabled={loading}>Cancel</ModalCancelButton>
                    <ModalSubmitButton onClick={handleSave} disabled={loading} type="button">
                        {loading ? "Saving..." : "Save"}
                    </ModalSubmitButton>
                </ModalFooter>
        </ModalSubWrapper>
        </ModalWrapper>
    );
}