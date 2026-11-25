/**
 * Sequelize model factory for the `show_roles` table: a role a member can hold
 * in a show.
 *
 * @remarks
 * Role `name` values such as `director` and `stage-manager` are matched as
 * plain strings by the authorization middleware, and department roles must
 * match a department name.
 */

export default (sequelize, DataTypes) => {
	const ShowRole = sequelize.define(
		"ShowRole",
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
			tableName: "show_roles",
		},
	);

	return ShowRole;
};
