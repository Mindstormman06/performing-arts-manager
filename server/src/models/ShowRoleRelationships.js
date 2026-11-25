/**
 * Sequelize model factory for `show_assignment_has_roles`, the join between a
 * show membership and the roles it holds.
 *
 * @remarks
 * The composite primary key is `assignment_id` (from `show_has_users`) plus
 * `role_id`. No timestamps.
 */

export default (sequelize, DataTypes) => {
	return sequelize.define(
		"ShowRoleRelationship",
		{
			assignment_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "show_has_users", key: "assignment_id" },
			},
			role_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "show_roles", key: "id" },
			},
		},
		{ tableName: "show_assignment_has_roles", timestamps: false },
	);
};
