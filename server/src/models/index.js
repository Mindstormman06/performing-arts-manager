import { DataTypes } from "sequelize";
import UserModel from './User.js';
import RoleModel from './Role.js';
import ShowModel from './Show.js';
import ScheduleModel from './Schedule.js';
import DepartmentModel from './Department.js';
import InventoryModel from './Inventory.js';
import NoteModel from './Note.js';
import CueModel from './Cue.js';
import UserGlobalRoleModel from './UserGlobalRole.js';
import ShowAssignmentModel from './ShowAssignment.js';
import ShowInventoryModel from './ShowInventory.js';
import UserScheduleModel from './UserSchedule.js';
import sequelize from "../services/db.service.js";

const models = {
    User: UserModel(sequelize, DataTypes),
    Role: RoleModel(sequelize, DataTypes),
    Show: ShowModel(sequelize, DataTypes),
    Schedule: ScheduleModel(sequelize, DataTypes),
    Department: DepartmentModel(sequelize, DataTypes),
    Inventory: InventoryModel(sequelize, DataTypes),
    Note: NoteModel(sequelize, DataTypes),
    Cue: CueModel(sequelize, DataTypes),
    UserGlobalRole: UserGlobalRoleModel(sequelize, DataTypes),
    ShowAssignment: ShowAssignmentModel(sequelize, DataTypes),
    ShowInventory: ShowInventoryModel(sequelize, DataTypes),
    UserSchedule: UserScheduleModel(sequelize, DataTypes),
};

// Global Roles
models.User.belongsToMany(models.Role, { through: models.UserGlobalRole, foreignKey: 'users_id', otherKey: 'roles_id', as: 'globalRoles' });
models.Role.belongsToMany(models.User, { through: models.UserGlobalRole, foreignKey: 'roles_id', otherKey: 'users_id' });

// Show Inventory (includes the user who added it to the show)
models.Inventory.belongsToMany(models.Show, { through: models.ShowInventory, foreignKey: 'inventory_id', otherKey: 'shows_id' });
models.Show.belongsToMany(models.Inventory, { through: models.ShowInventory, foreignKey: 'shows_id', otherKey: 'inventory_id' });
models.ShowInventory.belongsTo(models.User, { foreignKey: 'user_id', as: 'assignedUser' });
// Schedules Many-to-Many
models.Schedule.belongsToMany(models.User, { through: models.UserSchedule, foreignKey: 'schedules_id', otherKey: 'users_id' });
models.User.belongsToMany(models.Schedule, { through: models.UserSchedule, foreignKey: 'users_id', otherKey: 'schedules_id' });

// Show Assignments (The "Multi-Hat" Logic)
models.User.hasMany(models.ShowAssignment, { foreignKey: 'users_id' });
models.ShowAssignment.belongsTo(models.User, { foreignKey: 'users_id' });

models.Show.hasMany(models.ShowAssignment, { foreignKey: 'show_id' });
models.ShowAssignment.belongsTo(models.Show, { foreignKey: 'show_id' });

models.Role.hasMany(models.ShowAssignment, { foreignKey: 'role_id' });
models.ShowAssignment.belongsTo(models.Role, { foreignKey: 'role_id' });

models.Show.hasMany(models.Schedule, { foreignKey: 'show_id' });
models.Schedule.belongsTo(models.Show, { foreignKey: 'show_id' });

models.Show.hasMany(models.Note, { foreignKey: 'show_id' });
models.Note.belongsTo(models.Show, { foreignKey: 'show_id' });

// A User (Director/Stage Manager) creates many Schedules
models.User.hasMany(models.Schedule, { foreignKey: 'creator_id' });
models.Schedule.belongsTo(models.User, { foreignKey: 'creator_id' });

// A User (Author) writes many Notes
models.User.hasMany(models.Note, { foreignKey: 'author_id' });
models.Note.belongsTo(models.User, { foreignKey: 'author_id' });

// A User adds many items to the global Inventory
models.User.hasMany(models.Inventory, { foreignKey: 'added_by' });
models.Inventory.belongsTo(models.User, { foreignKey: 'added_by' });

// A Department (e.g., Costumes) owns many Inventory items
models.Department.hasMany(models.Inventory, { foreignKey: 'dept_id' });
models.Inventory.belongsTo(models.Department, { foreignKey: 'dept_id' });

// A Department can be the target of many Notes (e.g., a "Tech Note")
models.Department.hasMany(models.Note, { foreignKey: 'dept_id' });
models.Note.belongsTo(models.Department, { foreignKey: 'dept_id' });

// A show can have many cues
models.Show.hasMany(models.Cue, { foreignKey: 'show_id' });
models.Cue.belongsTo(models.Show, { foreignKey: 'show_id' });

// A inventory piece can be used for many cues
models.Inventory.hasMany(models.Cue, { foreignKey: 'light_id' });
models.Cue.belongsTo(models.Inventory, { foreignKey: 'light_id' });

Object.values(models).forEach((model) => {

    if (typeof model.associate === 'function') {
        model.associate(models);
    }
});

export default models;