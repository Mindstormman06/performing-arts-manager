/**
 * Sequelize model factory for `schedules_has_users`, the join between a
 * schedule event and the users called to it.
 *
 * @remarks
 * The composite primary key is `schedules_id` plus `users_id`. No timestamps.
 */

export default (sequelize, DataTypes) => {
	return sequelize.define(
		"UserSchedule",
		{
			schedules_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "schedules", key: "id" },
			},
			users_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "users", key: "id" },
			},
		},
		{ tableName: "schedules_has_users", timestamps: false },
	);
};
