export default (sequelize, DataTypes) => {
    const Cue = sequelize.define('Cue', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cue: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        page: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'cue',
    });

    return Cue;
}