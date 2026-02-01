export default (sequelize, DataTypes) => {
    return sequelize.define('OrgRole', {
        assignment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Part of composite key
            references: { model: 'org_has_users', key: 'assignment_id' }
        },
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true, // Part of composite key
            references: { model: 'roles', key: 'id' }
        }
    }, { tableName: 'org_assignment_has_roles', timestamps: false });
};