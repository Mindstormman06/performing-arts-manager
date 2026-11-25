/**
 * Sequelize model factory for the `layouts` table: a named stage layout for a
 * show.
 *
 * @remarks
 * Holds `name` and an optional `description`. The `show_id` foreign key comes
 * from associations in `models/index.js`, where a layout also has many stage
 * objects and lighting plots.
 */

export default (sequelize, DataTypes) => {
	const Layout = sequelize.define(
		"Layout",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
		},
		{
			tableName: "layouts",
		},
	);

	return Layout;
};
