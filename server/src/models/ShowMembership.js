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
			bio: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			photo_path: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
		},
		{ tableName: "show_has_users", timestamps: false },
	);
};
