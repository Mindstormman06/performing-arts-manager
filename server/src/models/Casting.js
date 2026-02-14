export default (sequelize, DataTypes) => {
	const Casting = sequelize.define(
		"Casting",
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
			tableName: "casting",
		},
	);

	return Casting;
};
