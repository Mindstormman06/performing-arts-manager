import { DataTypes } from "sequelize";
import UserModel from './User.js';
import RoleModel from './Role.js';
import ShowModel from './Show.js';
import ScheduleModel from './Schedule.js';
import DepartmentModel from './Department.js';
import InventoryModel from './Inventory.js';
import NoteModel from './Note.js';
import CueModel from './Cue.js';
import BudgetModel from './Budget.js';
import ExpenseModel from './Expense.js';
import LayoutModel from './Layout.js';
import StageObjectModel from './StageObject.js';
import LightingPlotModel from './LightingPlot.js';
import CastingModel from "./Casting.js";

import OrganizationModel from "./Organization.js";
import ShowInventoryModel from './ShowInventory.js';
import UserScheduleModel from './UserSchedule.js';

import OrgMembershipModel from './OrgMembership.js';
import OrgRoleModel from './OrgRole.js';

import ShowMembershipModel from './ShowMembership.js';
import ShowRoleModel from './ShowRole.js';

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
    Budget: BudgetModel(sequelize, DataTypes),
    Expense: ExpenseModel(sequelize, DataTypes),
    Layout: LayoutModel(sequelize, DataTypes),
    StageObject: StageObjectModel(sequelize, DataTypes),
    LightingPlot: LightingPlotModel(sequelize, DataTypes),
    Organization: OrganizationModel(sequelize, DataTypes),
    ShowInventory: ShowInventoryModel(sequelize, DataTypes),
    UserSchedule: UserScheduleModel(sequelize, DataTypes),
    Casting: CastingModel(sequelize, DataTypes),
    OrgMembership: OrgMembershipModel(sequelize, DataTypes),
    OrgRole: OrgRoleModel(sequelize, DataTypes),
    ShowMembership: ShowMembershipModel(sequelize, DataTypes),
    ShowRole: ShowRoleModel(sequelize, DataTypes),
};

// Show Inventory (includes the user who added it to the show)
models.Inventory.belongsToMany(models.Show, { through: models.ShowInventory, foreignKey: 'inventory_id', otherKey: 'shows_id' });
models.Show.belongsToMany(models.Inventory, { through: models.ShowInventory, foreignKey: 'shows_id', otherKey: 'inventory_id' });
models.ShowInventory.belongsTo(models.User, { foreignKey: 'user_id', as: 'assignedUser' });

// Schedules Many-to-Many
models.Schedule.belongsToMany(models.User, { through: models.UserSchedule, foreignKey: 'schedules_id', otherKey: 'users_id' });
models.User.belongsToMany(models.Schedule, { through: models.UserSchedule, foreignKey: 'users_id', otherKey: 'schedules_id' });

models.Show.hasMany(models.Schedule, { foreignKey: 'show_id' });
models.Schedule.belongsTo(models.Show, { foreignKey: 'show_id' });

// A Show has many Notes
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

// A budget can have one show
models.Show.hasOne(models.Budget, { foreignKey: 'show_id' });
models.Budget.belongsTo(models.Show, { foreignKey: 'show_id' });

// A show can have many expenses
models.Show.hasMany(models.Expense, { foreignKey: 'show_id' });
models.Expense.belongsTo(models.Show, { foreignKey: 'show_id' });

// A show can have many stage_layouts
models.Show.hasMany(models.Layout, { foreignKey: 'show_id' });
models.Layout.belongsTo(models.Show, { foreignKey: 'show_id' });

// A layout can have many stage_objects
models.Layout.hasMany(models.StageObject, { foreignKey: 'layout_id' });
models.StageObject.belongsTo(models.Layout, { foreignKey: 'layout_id' });

// A layout can have many lighting_plots
models.Layout.hasMany(models.LightingPlot, { foreignKey: 'layout_id' });
models.LightingPlot.belongsTo(models.Layout, { foreignKey: 'layout_id' });

// A user and show can have many castings
models.Show.hasMany(models.Casting, { foreignKey: 'show_id'});
models.User.hasMany(models.Casting, { foreignKey: 'users_id'});
models.Casting.belongsTo(models.Show, { foreignKey: 'show_id' });
models.Casting.belongsTo(models.User, { foreignKey: 'users_id' });

// Organization to Departments (One-to-Many)
models.Organization.hasMany(models.Department, { foreignKey: 'organization_id' });
models.Department.belongsTo(models.Organization, { foreignKey: 'organization_id' });

// Organization to Shows (One-to-Many)
models.Organization.hasMany(models.Show, { foreignKey: 'organization_id' });
models.Show.belongsTo(models.Organization, { foreignKey: 'organization_id' });

// Organization to Users (Many-to-Many)
models.Organization.belongsToMany(models.User, { through: models.OrgMembership, foreignKey: 'org_id', otherKey: 'users_id' });
models.User.belongsToMany(models.Organization, { through: models.OrgMembership, foreignKey: 'users_id', otherKey: 'org_id' });

models.User.hasMany(models.OrgMembership, { foreignKey: 'users_id' });
models.OrgMembership.belongsTo(models.User, { foreignKey: 'users_id' });

models.Organization.hasMany(models.OrgMembership, { foreignKey: 'org_id' });
models.OrgMembership.belongsTo(models.Organization, { foreignKey: 'org_id' });

// OrgMembership to Roles (Many-to-Many)
models.OrgMembership.belongsToMany(models.Role, { 
    through: models.OrgRole, 
    foreignKey: 'assignment_id', 
    otherKey: 'role_id',
    as: 'assignedRoles'
});

models.Role.belongsToMany(models.OrgMembership, { 
    through: models.OrgRole, 
    foreignKey: 'role_id', 
    otherKey: 'assignment_id' 
});


// Shows to Users (Many-to-Many)
models.Show.belongsToMany(models.User, { through: models.ShowMembership, foreignKey: 'show_id', otherKey: 'users_id' });
models.User.belongsToMany(models.Show, { through: models.ShowMembership, foreignKey: 'users_id', otherKey: 'show_id' });

models.User.hasMany(models.ShowMembership, { foreignKey: 'users_id' });
models.ShowMembership.belongsTo(models.User, { foreignKey: 'users_id' });

models.Show.hasMany(models.ShowMembership, { foreignKey: 'show_id' });
models.ShowMembership.belongsTo(models.Show, { foreignKey: 'show_id' });

// OrgMembership to Roles (Many-to-Many)
models.ShowMembership.belongsToMany(models.Role, { 
    through: models.ShowRole, 
    foreignKey: 'assignment_id', 
    otherKey: 'role_id',
    as: 'assignedRoles'
});

models.Role.belongsToMany(models.ShowMembership, { 
    through: models.ShowRole, 
    foreignKey: 'role_id', 
    otherKey: 'assignment_id' 
});


Object.values(models).forEach((model) => {

    if (typeof model.associate === 'function') {
        model.associate(models);
    }
});

export default models;