/**
 * Helpers for ranking show roles.
 *
 * @remarks
 * Exports `SHOW_ROLE_PRIORITY` (show role names, highest first),
 * `normalizeRoleNames`, `getHighestRoleWeight` and `isSelfDemotion`. A role's
 * weight grows with its position from the end of the list; a role not in the
 * list weighs 1 and an empty list weighs 0. Pure functions with no database
 * access.
 */

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

function normalizeRoleNames(roleNames) {
	if (!Array.isArray(roleNames)) return [];
	return roleNames
		.map((name) =>
			String(name || "")
				.toLowerCase()
				.trim(),
		)
		.filter(Boolean);
}

function getHighestRoleWeight(roleNames, orderedPriority) {
	const normalized = normalizeRoleNames(roleNames);
	if (!normalized.length) return 0;

	return normalized.reduce((best, roleName) => {
		const index = orderedPriority.indexOf(roleName);
		const weight = index >= 0 ? orderedPriority.length - index : 1;
		return Math.max(best, weight);
	}, 0);
}

function isSelfDemotion(previousRoles, nextRoles, orderedPriority) {
	const previousWeight = getHighestRoleWeight(previousRoles, orderedPriority);
	const nextWeight = getHighestRoleWeight(nextRoles, orderedPriority);

	if (previousWeight === 0) return false;
	return nextWeight < previousWeight;
}

export {
	getHighestRoleWeight,
	isSelfDemotion,
	normalizeRoleNames,
	SHOW_ROLE_PRIORITY,
};
