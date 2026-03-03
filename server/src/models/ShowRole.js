export default (sequelize, DataTypes) => {
	const OrganizationRole = sequelize.define(
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
			tableName: "roles",
		},
	);

	return OrganizationRole;
};
