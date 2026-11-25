/**
 * Sequelize model factory for the `departments` table (Lighting, Costumes and
 * so on), with no timestamps.
 *
 * @remarks
 * Inventory items and notes belong to a department. Authorization compares the
 * lowercased department `name` against a member's role names, so a department
 * name must match the role that grants access to its inventory.
 */

export default (sequelize, DataTypes) => {
	const Department = sequelize.define(
		"Department",
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
			tableName: "departments",
			timestamps: false,
		},
	);

	return Department;
};
