import models from "../models/index.js";

async function getUserOrganizations(userId) {
	return await models.OrgMembership.findAll({
		where: { users_id: userId },
		include: [
			{ model: models.Organization },
			{
				model: models.Role,
				as: "assignedRoles",
				through: { attributes: [] }, // Don't include junction table attributes
			},
		],
	});
}

async function addUserToOrg(orgId, userId) {
	const org = await models.Organization.findOne({ where: { id: orgId } });
	if (!org) throw new Error("Organization not found");

	const user = await models.User.findOne({ where: { id: userId } });
	if (!user) throw new Error("User not found");

	const existing = await models.OrgMembership.findOne({
		where: { org_id: orgId, users_id: userId },
	});
	if (existing) throw new Error("User already in organization");

	return await models.OrgMembership.create({
		org_id: orgId,
		users_id: userId,
	});
}

async function inviteByEmail(orgId, email) {
	const user = await models.User.findOne({ where: { email } });
	if (!user) throw new Error("No user found with that email.");

	const existing = await models.OrgMembership.findOne({
		where: { org_id: orgId, users_id: user.id },
	});
	if (existing)
		throw new Error("User is already in this organization or pending.");

	return await models.OrgMembership.create({
		org_id: orgId,
		users_id: user.id,
		status: "pending",
	});
}

export default { addUserToOrg, inviteByEmail, getUserOrganizations };
