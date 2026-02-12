export default (sequelize, DataTypes) => {
    return sequelize.define('ShowRole', {
        assignment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Part of composite key
            references: { model: 'show_has_users', key: 'assignment_id' }
        },
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Part of composite key
            references: { model: 'roles', key: 'id' }
        }
    }, { tableName: 'show_assignment_has_roles', timestamps: false });
};