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
