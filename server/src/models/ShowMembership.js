export default (sequelize, DataTypes) => {
	return sequelize.define(
		"ShowMembership",
		{
			assignment_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			users_id: {
				type: DataTypes.INTEGER,
				references: { model: "users", key: "id" },
			},
			show_id: {
				type: DataTypes.INTEGER,
				references: { model: "shows", key: "id" },
			},
			status: {
				type: DataTypes.ENUM("pending", "active"),
				defaultValue: "pending",
			},
		},
		{ tableName: "show_has_users", timestamps: false },
	);
};
