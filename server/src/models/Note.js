/**
 * Sequelize model factory for the `notes` table: a short note written about a
 * show.
 *
 * @remarks
 * Requires `show_id`, `author_id` and `content` (up to 255 characters);
 * `dept_id` is optional and targets the note at one department.
 */

export default (sequelize, DataTypes) => {
	const Note = sequelize.define(
		"Note",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			show_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			author_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			dept_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			content: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
		},
		{
			tableName: "notes",
		},
	);

	return Note;
};
