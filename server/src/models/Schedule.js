/**
 * Sequelize model factory for the `schedules` table: a calendar event such as a
 * rehearsal.
 *
 * @remarks
 * Requires `title`, `start_time` and `end_time`, with optional `location` and
 * `description`. `org_id` and `show_id` are both nullable so an event can
 * belong to an organization, a show, or both. Attendees and required characters
 * are linked through `UserSchedule` and `ScheduleCasting`.
 */

export default (sequelize, DataTypes) => {
	const Schedule = sequelize.define(
		"Schedule",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},

			title: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},

			start_time: {
				type: DataTypes.DATE,
				allowNull: false,
			},

			end_time: {
				type: DataTypes.DATE,
				allowNull: false,
			},

			location: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},

			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},

			org_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},

			show_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{ tableName: "schedules" },
	);
	return Schedule;
};
