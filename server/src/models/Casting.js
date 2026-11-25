/**
 * Sequelize model factory for the `casting` table: a named character in a show
 * and the user cast in it.
 *
 * @remarks
 * Requires `name` and `show_id`; `users_id` is nullable so a character can
 * exist before it is cast. Both foreign keys are indexed. Characters are linked
 * to schedules through `ScheduleCasting` and can be assigned inventory through
 * `ShowInventory.assigned_character_id`.
 */

export default (sequelize, DataTypes) => {
	const Casting = sequelize.define(
		"Casting",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			show_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			users_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			tableName: "casting",
			indexes: [
				{
					fields: ["show_id"],
				},
				{
					fields: ["users_id"],
				},
			],
		},
	);

	return Casting;
};
