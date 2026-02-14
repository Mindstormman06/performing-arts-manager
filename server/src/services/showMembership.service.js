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
	if (existing) throw new Error("User already in showanization");

	// Create membership without any roles in the second join table
	return await models.ShowMembership.create({
		show_id: showId,
		users_id: userId,
	});
}

export default { addUserToShow };
