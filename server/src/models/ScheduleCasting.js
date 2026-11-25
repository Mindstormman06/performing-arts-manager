/**
 * Sequelize model factory for `schedules_has_casting`, the join between a
 * schedule event and the characters called to it.
 *
 * @remarks
 * The composite primary key is `schedules_id` plus `casting_id`. No timestamps.
 */

export default (sequelize, DataTypes) => {
	return sequelize.define(
		"ScheduleCasting",
		{
			schedules_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "schedules", key: "id" },
			},
			casting_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "casting", key: "id" },
			},
		},
		{ tableName: "schedules_has_casting", timestamps: false },
	);
};
