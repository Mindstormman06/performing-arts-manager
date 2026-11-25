/**
 * Sequelize model factory for `org_assignment_has_roles`, the join between an
 * org membership and the roles it holds.
 *
 * @remarks
 * The composite primary key is `assignment_id` (from `org_has_users`) plus
 * `role_id`. No timestamps.
 */

export default (sequelize, DataTypes) => {
	return sequelize.define(
		"OrgRoleRelationship",
		{
			assignment_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "org_has_users", key: "assignment_id" },
			},
			role_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "org_roles", key: "id" },
			},
		},
		{ tableName: "org_assignment_has_roles", timestamps: false },
	);
};
