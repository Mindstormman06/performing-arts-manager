export default (sequelize, DataTypes) => {
    const Inventory = sequelize.define('Inventory', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        dept_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_global: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        added_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'inventory',
    });

    return Inventory;
}