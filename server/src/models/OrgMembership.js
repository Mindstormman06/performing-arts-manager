/**
 * Sequelize model factory for `org_has_users`, the membership of a user in an
 * organization.
 *
 * @remarks
 * Each row has its own `assignment_id`, which org roles attach to through
 * `OrgRoleRelationship`. `status` is `pending` (invited) or `active`, and only
 * active memberships pass authorization. No timestamps.
 */

export default (sequelize, DataTypes) => {
	return sequelize.define(
		"OrgMembership",
		{
			assignment_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			users_id: {
				type: DataTypes.INTEGER,
				references: { model: "users", key: "id" },
			},
			org_id: {
				type: DataTypes.INTEGER,
				references: { model: "organizations", key: "id" },
			},
			status: {
				type: DataTypes.ENUM("pending", "active"),
				defaultValue: "pending",
			},
		},
		{ tableName: "org_has_users", timestamps: false },
	);
};
