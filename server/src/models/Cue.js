/**
 * Sequelize model factory for the `cues` table: a cue in a show's script.
 *
 * @remarks
 * Requires a `cue` label (up to 5 characters) and a `page` number, with an
 * optional `description`. The `show_id` and `light_id` (inventory item)
 * foreign keys come from associations in `models/index.js`.
 */

export default (sequelize, DataTypes) => {
	const Cue = sequelize.define(
		"Cue",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			cue: {
				type: DataTypes.STRING(5),
				allowNull: false,
			},
			page: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
		},
		{
			tableName: "cues",
		},
	);

	return Cue;
};
