export default (sequelize, DataTypes) => {
    return sequelize.define('ShowInventory', {
        inventory_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'inventory', key: 'id' }
        },
        shows_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: { model: 'shows', key: 'id' }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: 'users', key: 'id' }
        }
    }, { tableName: 'inventory_has_shows', timestamps: false });
};