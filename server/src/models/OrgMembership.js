export default (sequelize, DataTypes) => {
    return sequelize.define('OrgMembership', {
        assignment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        users_id: {
            type: DataTypes.INTEGER,
            references: { model: 'users', key: 'id' }
        },
        org_id: {
            type: DataTypes.INTEGER,
            references: { model: 'organizations', key: 'id' }
        },
        status: {
            type: DataTypes.ENUM('pending', 'active'),
            defaultValue: 'pending'
        }
    }, { tableName: 'org_has_users', timestamps: false });
};