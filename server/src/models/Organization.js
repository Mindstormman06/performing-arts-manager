/**
 * Sequelize model factory for the `organizations` table: a theatre company that
 * owns shows, inventory and schedules.
 *
 * @remarks
 * Holds only `id` and a required `name`; members are linked through the
 * `OrgMembership` model.
 */

export default (sequelize, DataTypes) => {
	const Organization = sequelize.define(
		"Organization",
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
			tableName: "organizations",
		},
	);

	return Organization;
};
