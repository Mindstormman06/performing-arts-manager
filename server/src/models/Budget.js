/**
 * Sequelize model factory for the `budgets` table, holding a show's budget.
 *
 * @remarks
 * Defines `id` and a required `amount` (DECIMAL 10,2) with timestamps. The
 * `show_id` foreign key is not declared here; it comes from the
 * `Show.hasOne(Budget)` association in `models/index.js`.
 */

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
