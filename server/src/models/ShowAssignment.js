export default (sequelize, DataTypes) => {
    return sequelize.define('ShowAssignment', {
        assignment_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        users_id: {
            type: DataTypes.INTEGER,
            references: { model: 'users', key: 'id' }
        },
        role_id: {
            type: DataTypes.INTEGER,
            references: { model: 'roles', key: 'id' }
        },
        show_id: {
            type: DataTypes.INTEGER,
            references: { model: 'shows', key: 'id' }
        }
    }, { tableName: 'shows_has_users', timestamps: false });
};