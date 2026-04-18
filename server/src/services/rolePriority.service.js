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
