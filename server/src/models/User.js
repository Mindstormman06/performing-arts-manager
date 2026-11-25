/**
 * Sequelize model factory for the `users` table: a person with a login.
 *
 * @remarks
 * `email` is unique and validated. The default scope leaves out
 * `passwordHash`, `sessionToken` and `sessionExpiry`, so queries never return
 * credentials unless they use the `withPassword` scope or list the attributes.
 */

export default (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			fname: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			lname: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING(255),
				allowNull: false,
				unique: true,
				validate: { isEmail: true },
			},
			phone: {
				type: DataTypes.STRING(20),
				allowNull: true,
			},
			passwordHash: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			sessionToken: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			sessionExpiry: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			tableName: "users",
			defaultScope: {
				attributes: {
					exclude: ["passwordHash", "sessionToken", "sessionExpiry"],
				},
			},
			scopes: {
				withPassword: { attributes: { include: ["passwordHash"] } },
			},
		},
	);

	return User;
};
