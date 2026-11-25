/**
 * Sequelize model factory for `inventory_has_shows`, the join between an
 * inventory item and a show it is used in.
 *
 * @remarks
 * The composite primary key is `inventory_id` plus `shows_id`. `user_id` and
 * `assigned_character_id` optionally assign the item to a member or a cast
 * character. No timestamps.
 */

export default (sequelize, DataTypes) => {
	return sequelize.define(
		"ShowInventory",
		{
			inventory_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "inventory", key: "id" },
			},
			shows_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "shows", key: "id" },
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: { model: "users", key: "id" },
			},
			assigned_character_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: { model: "casting", key: "id" },
			},
		},
		{ tableName: "inventory_has_shows", timestamps: false },
	);
};
