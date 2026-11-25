/**
 * Sequelize model factory for the `org_roles` table: a role a member can hold
 * in an organization.
 *
 * @remarks
 * Role `name` values such as `admin`, `president` and `board-member` are
 * matched as plain strings by the authorization middleware, and department
 * roles must match a department name.
 */

export default (sequelize, DataTypes) => {
	const OrganizationRole = sequelize.define(
		"OrganizationRole",
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
		},
		{
			tableName: "org_roles",
		},
	);

	return OrganizationRole;
};
