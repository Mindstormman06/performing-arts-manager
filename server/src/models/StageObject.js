export default (sequelize, DataTypes) => {
	const StageObject = sequelize.define(
		"StageObject",
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
			type: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			shape: {
				type: DataTypes.ENUM(
					"circle",
					"square",
					"rectangle",
					"triangle",
					"custom",
				),
				allowNull: true,
			},
			colour: {
				type: DataTypes.STRING(7),
				allowNull: true,
			},
			sizeX: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			sizeY: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			posX: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			posY: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			rotation: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
		},
		{
			tableName: "stage_objects",
		},
	);

	return StageObject;
};
