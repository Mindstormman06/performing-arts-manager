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
			show_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			users_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			tableName: "casting",
			indexes: [
				{
					fields: ["show_id"],
				},
				{
					fields: ["users_id"],
				},
			],
		},
	);

	return Casting;
};
