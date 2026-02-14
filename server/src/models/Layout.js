export default (sequelize, DataTypes) => {
	const Layout = sequelize.define(
		"Layout",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
		},
		{
			tableName: "layouts",
		},
	);

	return Layout;
};
