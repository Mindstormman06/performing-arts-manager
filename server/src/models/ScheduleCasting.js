export default (sequelize, DataTypes) => {
	return sequelize.define(
		"ScheduleCasting",
		{
			schedules_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "schedules", key: "id" },
			},
			casting_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				references: { model: "casting", key: "id" },
			},
		},
		{ tableName: "schedules_has_casting", timestamps: false },
	);
};

