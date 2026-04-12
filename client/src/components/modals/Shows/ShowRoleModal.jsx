import { useState, useEffect, useRef } from "react";
import { updateShowUserRoles, getAvailableShowRoles, getShowUser } from "../../../services/api.js";
import { BACKEND_URL } from "../../../services/config.js";
import {
    ModalBody,
    ModalCancelButton,
    ModalCheckbox,
    ModalError,
    ModalFooter,
    ModalHeader,
    ModalLabel,
    ModalSubWrapper,
    ModalWrapper
} from "../../ui/modals/index.js";

const SHOW_ROLE_PRIORITY = [
    "director",
    "co-director",
    "stage-manager",
    "producer",
    "choreographer",
    "dance-captain",
    "sound-design",
    "lighting-design",
    "costumes",
    "props",
    "sets",
    "tech",
    "photographer",
    "crew",
    "actor",
];

const getRoleWeight = (roleName) => {
    const normalized = String(roleName || "").toLowerCase();
    const index = SHOW_ROLE_PRIORITY.indexOf(normalized);
    return index >= 0 ? SHOW_ROLE_PRIORITY.length - index : 1;
};

export default function ShowRoleModal({ isOpen, onClose, showId, user, canEditRoles = false, currentUserId = null, currentUserRoles = [] }) {
    const loading = false;
    const [error, setError] = useState("");
    const [availableRoles, setAvailableRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [isEditingRoles, setIsEditingRoles] = useState(false);
    const [resolvedMember, setResolvedMember] = useState(null);

    const popoverRef = useRef(null);

    useEffect(() => {
        if (isOpen && user) {
            const timer = window.setTimeout(() => {
                setError("");
                setIsEditingRoles(false);
                setResolvedMember(user);
                setSelectedRoles(user.assignedRoles?.map((r) => r.name) || []);
            }, 0);

            getShowUser(showId, user.users_id)
                .then((response) => {
                    const payload = response.data?.data || response.data;
                    if (payload) {
                        setResolvedMember(payload);
                    }
                })
                .catch(() => {
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

            return () => window.clearTimeout(timer);
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

    const highestSelectedRoleWeight = selectedRoles.reduce(
        (highest, roleName) => Math.max(highest, getRoleWeight(roleName)),
        0,
    );
    const lockedHighestRoles = new Set(
        selectedRoles.filter((roleName) => getRoleWeight(roleName) === highestSelectedRoleWeight),
    );
    const memberId = resolvedMember?.users_id ?? user?.users_id ?? null;
    const isEditingSelf = Number(currentUserId) === Number(memberId);
    const normalizedCurrentUserRoles = currentUserRoles.map((role) => String(role || "").toLowerCase());
    const hasOrgLevelOverride = normalizedCurrentUserRoles.some((role) =>
        ["president", "board-member", "admin"].includes(role),
    );
    const currentUserHighestRoleWeight = normalizedCurrentUserRoles.reduce(
        (highest, roleName) => Math.max(highest, getRoleWeight(roleName)),
        0,
    );
    const maxAssignableRoleWeight = hasOrgLevelOverride ? Number.POSITIVE_INFINITY : currentUserHighestRoleWeight;
    const baseAssignedRoles = (resolvedMember?.assignedRoles || user?.assignedRoles || []).map((role) => role.name);
    const highestBaseRoleWeight = baseAssignedRoles.reduce(
        (highest, roleName) => Math.max(highest, getRoleWeight(roleName)),
        0,
    );

    const handleToggle = async (role) => {
        setError("");

        if (selectedRoles.includes(role) && lockedHighestRoles.has(role)) {
            setError("Highest role cannot be removed");
            return;
        }

        if (isEditingSelf && !selectedRoles.includes(role) && getRoleWeight(role) > highestBaseRoleWeight) {
            setError("You cannot assign yourself a higher role");
            return;
        }

        if (!selectedRoles.includes(role) && getRoleWeight(role) > maxAssignableRoleWeight) {
            setError("You cannot assign roles higher than your highest role");
            return;
        }

        const isAdding = !selectedRoles.includes(role);
        const updatedRoles = isAdding
            ? [...selectedRoles, role]
            : selectedRoles.filter((r) => r !== role);

        setSelectedRoles(updatedRoles);

        try {
            const hiddenRoles = user?.assignedRoles?.map((r) => r.name).filter((name) => !availableRoles.includes(name)) || [];
            const finalRoles = [...new Set([...updatedRoles, ...hiddenRoles])];

            await updateShowUserRoles(showId, user.users_id, finalRoles);


        } catch (err) {
            setSelectedRoles(selectedRoles);
            setError(err.response?.data?.message || "Failed to update role");
        }
    };

    const handleClose = () => {
        // onSuccess(); // Uncomment this if the parent needs to refetch data after editing
        onClose();
    };

    const memberUser = resolvedMember?.User || user?.User || {};
    const memberBio = resolvedMember?.bio ?? user?.bio ?? "";
    const memberPhotoPath = resolvedMember?.photo_path ?? user?.photo_path ?? "";
    const memberPhotoUrl = memberPhotoPath ? `${BACKEND_URL}${memberPhotoPath}` : "";

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
                                                    {availableRoles.map((role) => {
                                                        const isLockedHighestRole = selectedRoles.includes(role) && lockedHighestRoles.has(role);
                                                        const isHigherSelfPromotionRole = isEditingSelf && !selectedRoles.includes(role) && getRoleWeight(role) > highestBaseRoleWeight;
                                                        const isHigherThanEditorRole = !selectedRoles.includes(role) && getRoleWeight(role) > maxAssignableRoleWeight;
                                                        const isDisabledRole = isLockedHighestRole || isHigherSelfPromotionRole || isHigherThanEditorRole;
                                                        const disabledTitle = isLockedHighestRole
                                                            ? "Highest role cannot be removed"
                                                            : isHigherSelfPromotionRole
                                                                ? "You cannot assign yourself a higher role"
                                                                : isHigherThanEditorRole
                                                                    ? "You cannot assign roles higher than your highest role"
                                                                    : undefined;

                                                        return (
                                                        <ModalLabel
                                                            key={role}
                                                            variant="checkbox"
                                                            className={`mb-0 flex items-center rounded p-1 ${isDisabledRole
                                                                ? "cursor-not-allowed bg-gray-100"
                                                                : "cursor-pointer hover:bg-gray-50"
                                                                }`}
                                                            title={disabledTitle}
                                                        >
                                                            <ModalCheckbox
                                                                checked={selectedRoles.includes(role)}
                                                                disabled={isDisabledRole}
                                                                onChange={() => handleToggle(role)}
                                                            />
                                                            <span className={`ml-2 text-sm capitalize ${isDisabledRole ? "text-gray-400" : "text-gray-700"}`}>{role}</span>
                                                        </ModalLabel>
                                                        );
                                                    })}
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
                                    {memberBio || "Bio placeholder"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start justify-center md:justify-end">
                            {memberPhotoUrl ? (
                                <img
                                    src={memberPhotoUrl}
                                    alt={`${memberUser.fname || "Member"} ${memberUser.lname || ""}`.trim()}
                                    className="h-72 w-60 rounded-2xl object-cover shadow-sm"
                                />
                            ) : (
                                <div className="flex h-72 w-60 items-center justify-center rounded-2xl bg-gray-500 text-6xl font-light text-white">
                                    Photo
                                </div>
                            )}
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