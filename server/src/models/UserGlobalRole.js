export default (sequelize, DataTypes) => {
    return sequelize.define('UserGlobalRole', {
        roles_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'roles', key: 'id' }
        },
        users_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'users', key: 'id' }
        }
    }, { tableName: 'roles_global_has_users', timestamps: false });
};