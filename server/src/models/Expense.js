/**
 * Sequelize model factory for the `expenses` table: one spending entry for a
 * show.
 *
 * @remarks
 * Requires an `amount` (DECIMAL 10,2) with an optional `description`. The
 * `show_id` foreign key comes from the `Show.hasMany(Expense)` association in
 * `models/index.js`.
 */

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
