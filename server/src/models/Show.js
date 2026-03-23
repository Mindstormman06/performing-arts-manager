export default (sequelize, DataTypes) => {
	const Show = sequelize.define(
		"Show",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			start_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			end_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			organization_id: {
				type: DataTypes.INTEGER,
				references: { model: "organizations", key: "id" },
			},
		},
		{
			tableName: "shows",
		},
	);

	return Show;
};
