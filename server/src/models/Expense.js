export default (sequelize, DataTypes) => {
	const Expense = sequelize.define(
		"Expense",
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
			description: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
		},
		{
			tableName: "expenses",
		},
	);

	return Expense;
};
