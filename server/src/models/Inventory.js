/**
 * Sequelize model factory for the `inventory` table: an item owned by an
 * organization and a department.
 *
 * @remarks
 * Requires `name`, `description`, `dept_id`, `org_id`, `added_by` (user id)
 * and `is_global` (an integer flag); `photo_path` is an optional upload URL.
 * Items are attached to shows through the `ShowInventory` join model.
 */

export default (sequelize, DataTypes) => {
	const Inventory = sequelize.define(
		"Inventory",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			dept_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			is_global: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			added_by: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			org_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			photo_path: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
		},
		{
			tableName: "inventory",
		},
	);

	return Inventory;
};
