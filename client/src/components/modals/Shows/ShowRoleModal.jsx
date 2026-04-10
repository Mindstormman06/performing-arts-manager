import { useState, useEffect, useRef } from "react";
import { updateShowUserRoles, getAvailableShowRoles, getShowUser } from "../../../services/api.js";
import {
    ModalBody,
    ModalCancelButton,
    ModalCheckbox,
    ModalError,
    ModalFooter,
    ModalHeader,
    ModalLabel,
    ModalSubHeader,
    ModalSubmitButton,
    ModalSubWrapper,
    ModalWrapper
} from "../../ui/modals/index.js";

export default function ShowRoleModal({ isOpen, onClose, onSuccess, showId, user, canEditRoles = false }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [isEditingRoles, setIsEditingRoles] = useState(false);
    const [resolvedMember, setResolvedMember] = useState(null);

    const popoverRef = useRef(null);

    useEffect(() => {
        if (isOpen && user) {
            setSelectedRoles(user.assignedRoles?.map((r) => r.name) || []);
            setError("");
            setIsEditingRoles(false);
            setResolvedMember(user);

            getShowUser(showId, user.users_id)
                .then((response) => {
                    const payload = response.data?.data || response.data;
                    if (payload) {
                        setResolvedMember(payload);
                    }
                })
                .catch(() => {
                    // Keep current member payload if detailed fetch fails.
                });

            getAvailableShowRoles()
                .then((response) => {
                    const roleNames = response.data.data.map(role => role.name);
                    setAvailableRoles(roleNames);
                })
                .catch((err) => {
                    console.error("Failed to load available roles:", err);
                    setError("Failed to load available roles");
                });
        }
    }, [isOpen, user, showId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsEditingRoles(false);
            }
        };

        if (isEditingRoles) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditingRoles]);

    if (!isOpen) return null;

    const handleToggle = async (role) => {
        setError("");

        // Optimistically update the UI instantly
        const isAdding = !selectedRoles.includes(role);
        const updatedRoles = isAdding
            ? [...selectedRoles, role]
            : selectedRoles.filter((r) => r !== role);

        setSelectedRoles(updatedRoles);

        try {
            const hiddenRoles = user?.assignedRoles?.map((r) => r.name).filter((name) => !availableRoles.includes(name)) || [];
            const finalRoles = [...new Set([...updatedRoles, ...hiddenRoles])];

            // Make the API call in the background
            await updateShowUserRoles(showId, user.users_id, finalRoles);

            // Note: onSuccess() is removed from here so it doesn't trigger a page reload
            // or parent state refresh while the user is actively clicking checkboxes.
        } catch (err) {
            // If it fails, revert the checkbox visually and show an error
            setSelectedRoles(selectedRoles);
            setError(err.response?.data?.message || "Failed to update role");
        }
    };

    // Optional: If you DO need the parent to refresh, do it when the modal closes instead
    const handleClose = () => {
        // onSuccess(); // Uncomment this if the parent needs to refetch data after editing
        onClose();
    };

    const memberUser = resolvedMember?.User || user?.User || {};

    return (
        <ModalWrapper>
            <ModalSubWrapper>
                <ModalHeader onClick={handleClose}>Member Profile</ModalHeader>

                {error && <ModalError>{error}</ModalError>}

                <ModalBody>
                    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_14rem]">
                        <div>
                            <h2 className="font-semibold text-4xl text-gray-500 leading-tight">
                                {memberUser.fname} {memberUser.lname}
                            </h2>

                            <div className="mt-4 flex items-start gap-3">
                                {canEditRoles && (
                                    <div className="relative flex items-center shrink-0">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsEditingRoles(!isEditingRoles);
                                            }}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm transition-colors hover:bg-blue-100"
                                            aria-label="Edit roles"
                                            title="Edit roles"
                                        >
                                            ✎
                                        </button>

                                        {isEditingRoles && (
                                            <div
                                                ref={popoverRef}
                                                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-xl"
                                            >
                                                <div className="border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 rounded-t-lg">
                                                    Assign Roles
                                                </div>
                                                <div className="max-h-48 space-y-1 overflow-y-auto p-2">
                                                    {availableRoles.map((role) => (
                                                        <ModalLabel key={role} variant="checkbox" className="!mb-0 flex items-center rounded p-1 hover:bg-gray-50 cursor-pointer">
                                                            <ModalCheckbox
                                                                checked={selectedRoles.includes(role)}
                                                                onChange={() => handleToggle(role)}
                                                            />
                                                            <span className="ml-2 text-sm capitalize text-gray-700">{role}</span>
                                                        </ModalLabel>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 pt-0.5">
                                    {selectedRoles.length > 0 ? (
                                        selectedRoles.map((role) => (
                                            <span key={role} className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white capitalize">
                                                {role}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                                            No roles assigned
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 space-y-1 text-black">
                                <p className="text-lg">Email: {memberUser.email || "Not provided"}</p>
                                <p className="text-lg">Phone: {memberUser.phone || "Not provided"}</p>
                            </div>

                            <div className="mt-5">
                                <h3 className="mb-1 font-medium text-xl text-gray-700">Bio</h3>
                                <p className="text-base text-gray-600 leading-7">
                                    {memberUser.bio || "Bio placeholder"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start justify-center md:justify-end">
                            <div className="flex h-72 w-60 items-center justify-center rounded-2xl bg-gray-500 text-6xl font-light text-white">
                                Photo
                            </div>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <ModalCancelButton onClick={handleClose} disabled={loading}>Close</ModalCancelButton>
                </ModalFooter>
            </ModalSubWrapper>
        </ModalWrapper>
    );
}