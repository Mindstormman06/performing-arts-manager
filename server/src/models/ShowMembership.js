/**
 * Sequelize model factory for `show_has_users`, the membership of a user in a
 * show.
 *
 * @remarks
 * Each row has its own `assignment_id`, which show roles attach to through
 * `ShowRoleRelationship`. `status` is `pending` or `active`, and only active
 * memberships pass authorization. Also stores the member's show-specific `bio`
 * and `photo_path`. No timestamps.
 */

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
