export default (sequelize, DataTypes) => {
	const LightingPlot = sequelize.define(
		"LightingPlot",
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
			channel: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			dmx_address: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			colour: {
				type: DataTypes.STRING(7),
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
			tableName: "lighting_plots",
		},
	);

	return LightingPlot;
};
