export default (sequelize, DataTypes) => {
    return sequelize.define('UserSchedule', {
        schedules_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'schedules', key: 'id' }
        },
        users_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'users', key: 'id' }
        }
    }, { tableName: 'schedules_has_users', timestamps: false });
};