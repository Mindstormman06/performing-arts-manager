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
				unique: false,
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
		},
	);

	return User;
};
