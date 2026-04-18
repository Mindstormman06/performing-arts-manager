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
