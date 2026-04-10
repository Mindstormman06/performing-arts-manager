import models from "../models/index.js";

async function addUserToShow(showId, userId) {
	const show = await models.Show.findOne({ where: { id: showId } });
	if (!show) throw new Error("Show not found");

	const user = await models.User.findOne({ where: { id: userId } });
	if (!user) throw new Error("User not found");

	// Check if membership already exists
	const existing = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
	});
	if (existing) throw new Error("User already in show");

	// Create membership without any roles in the second join table
	return await models.ShowMembership.create({
		show_id: showId,
		users_id: userId,
		status: "active",
	});
}

async function inviteByEmail(orgId, showId, email) {
	const user = await models.User.findOne({ where: { email } });
	if (!user) throw new Error("No user found with that email.");

	let orgMembership = await models.OrgMembership.findOne({
		where: { org_id: orgId, users_id: user.id },
	});

	if (!orgMembership) {
		orgMembership = await models.OrgMembership.create({
			org_id: orgId,
			users_id: user.id,
			status: "pending",
		});
	}

	const existingShowMembership = await models.ShowMembership.findOne({
		where: {show_id: showId, users_id: user.id }
	});

	if (existingShowMembership) {
		throw new Error("User is already a member of the show.");
	}

	const showStatus = orgMembership.status === "pending" ? "pending" : "active";

	return await models.ShowMembership.create({
		show_id: showId,
		users_id: user.id,
		status: showStatus,
	});

}

async function updateProfile(showId, userId, bio, photoPath) {
	const membership = await models.ShowMembership.findOne({
		where: { show_id: showId, users_id: userId },
	});

	if (!membership) {
		throw new Error("Show membership not found.");
	}

	const updateData = {};
	if (bio !== undefined) updateData.bio = bio;
	if (photoPath !== undefined) updateData.photo_path = photoPath;

	return await membership.update(updateData);
}

export default { addUserToShow, inviteByEmail, updateProfile };
