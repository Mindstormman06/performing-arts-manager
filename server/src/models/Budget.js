export default (sequelize, DataTypes) => {
	const Budget = sequelize.define(
		"Budget",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			amount: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
		},
		{
			tableName: "budgets",
		},
	);

	return Budget;
};
