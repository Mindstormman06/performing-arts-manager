import { DataTypes } from "sequelize";

import sequelize from "../services/db.service.js";
import BudgetModel from "./Budget.js";
import CastingModel from "./Casting.js";
import CueModel from "./Cue.js";
import DepartmentModel from "./Department.js";
import ExpenseModel from "./Expense.js";
import InventoryModel from "./Inventory.js";
import LayoutModel from "./Layout.js";
import LightingPlotModel from "./LightingPlot.js";
import NoteModel from "./Note.js";
import OrganizationModel from "./Organization.js";
import OrganizationRoleModel from "./OrganizationRole.js";
import OrgMembershipModel from "./OrgMembership.js";
import OrgRoleRelationshipsModel from "./OrgRoleRelationships.js";
import ScheduleModel from "./Schedule.js";
import ShowModel from "./Show.js";
import ShowInventoryModel from "./ShowInventory.js";
import ShowMembershipModel from "./ShowMembership.js";
import ShowRoleModel from "./ShowRole.js";
import ShowRoleRelationshipsModel from "./ShowRoleRelationships.js";
import StageObjectModel from "./StageObject.js";
import UserModel from "./User.js";
import UserScheduleModel from "./UserSchedule.js";

const models = {
	User: UserModel(sequelize, DataTypes),
	OrganizationRole: OrganizationRoleModel(sequelize, DataTypes),
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
	OrgRoleRelationship: OrgRoleRelationshipsModel(sequelize, DataTypes),
	ShowMembership: ShowMembershipModel(sequelize, DataTypes),
	ShowRoleRelationship: ShowRoleRelationshipsModel(sequelize, DataTypes),
	ShowRole: ShowRoleModel(sequelize, DataTypes),
};

// Show Inventory (includes the user who added it to the show)
models.Inventory.belongsToMany(models.Show, {
	through: models.ShowInventory,
	foreignKey: "inventory_id",
	otherKey: "shows_id",
});
models.Show.belongsToMany(models.Inventory, {
	through: models.ShowInventory,
	foreignKey: "shows_id",
	otherKey: "inventory_id",
});
models.ShowInventory.belongsTo(models.User, {
	foreignKey: "user_id",
	as: "assignedUser",
});

// Schedules Many-to-Many
models.Schedule.belongsToMany(models.User, {
	through: models.UserSchedule,
	foreignKey: "schedules_id",
	otherKey: "users_id",
	as: "attendees",
});
models.User.belongsToMany(models.Schedule, {
	through: models.UserSchedule,
	foreignKey: "users_id",
	otherKey: "schedules_id",
	as: "scheduledEvents",
});

models.Show.hasMany(models.Schedule, { foreignKey: "show_id" });
models.Schedule.belongsTo(models.Show, { foreignKey: "show_id" });

// A Show has many Notes
models.Show.hasMany(models.Note, { foreignKey: "show_id" });
models.Note.belongsTo(models.Show, { foreignKey: "show_id" });

// A User (Director/Stage Manager) creates many Schedules
models.User.hasMany(models.Schedule, { foreignKey: "creator_id", as: "createdSchedules" });
models.Schedule.belongsTo(models.User, { foreignKey: "creator_id", as: "creator" });

// A User (Author) writes many Notes
models.User.hasMany(models.Note, { foreignKey: "author_id" });
models.Note.belongsTo(models.User, { foreignKey: "author_id" });

// A User adds many items to the global Inventory
models.User.hasMany(models.Inventory, { foreignKey: "added_by" });
models.Inventory.belongsTo(models.User, { foreignKey: "added_by" });

// A Department (e.g., Costumes) owns many Inventory items
models.Department.hasMany(models.Inventory, { foreignKey: "dept_id" });
models.Inventory.belongsTo(models.Department, { foreignKey: "dept_id" });

// A Department can be the target of many Notes (e.g., a "Tech Note")
models.Department.hasMany(models.Note, { foreignKey: "dept_id" });
models.Note.belongsTo(models.Department, { foreignKey: "dept_id" });

// A show can have many cues
models.Show.hasMany(models.Cue, { foreignKey: "show_id" });
models.Cue.belongsTo(models.Show, { foreignKey: "show_id" });

// A inventory piece can be used for many cues
models.Inventory.hasMany(models.Cue, { foreignKey: "light_id" });
models.Cue.belongsTo(models.Inventory, { foreignKey: "light_id" });

// A budget can have one show
models.Show.hasOne(models.Budget, { foreignKey: "show_id" });
models.Budget.belongsTo(models.Show, { foreignKey: "show_id" });

// A show can have many expenses
models.Show.hasMany(models.Expense, { foreignKey: "show_id" });
models.Expense.belongsTo(models.Show, { foreignKey: "show_id" });

// A show can have many stage_layouts
models.Show.hasMany(models.Layout, { foreignKey: "show_id" });
models.Layout.belongsTo(models.Show, { foreignKey: "show_id" });

// A layout can have many stage_objects
models.Layout.hasMany(models.StageObject, { foreignKey: "layout_id" });
models.StageObject.belongsTo(models.Layout, { foreignKey: "layout_id" });

// A layout can have many lighting_plots
models.Layout.hasMany(models.LightingPlot, { foreignKey: "layout_id" });
models.LightingPlot.belongsTo(models.Layout, { foreignKey: "layout_id" });

// A user and show can have many castings
models.Show.hasMany(models.Casting, { foreignKey: "show_id" });
models.User.hasMany(models.Casting, { foreignKey: "users_id" });
models.Casting.belongsTo(models.Show, { foreignKey: "show_id" });
models.Casting.belongsTo(models.User, { foreignKey: "users_id" });

// Organization to Departments (One-to-Many)
models.Organization.hasMany(models.Inventory, { foreignKey: "org_id" });
models.Inventory.belongsTo(models.Organization, { foreignKey: "org_id" });

// Organization to Shows (One-to-Many)
models.Organization.hasMany(models.Show, { foreignKey: "organization_id" });
models.Show.belongsTo(models.Organization, { foreignKey: "organization_id" });

// Organization to Users (Many-to-Many)
models.Organization.belongsToMany(models.User, {
	through: models.OrgMembership,
	foreignKey: "org_id",
	otherKey: "users_id",
});
models.User.belongsToMany(models.Organization, {
	through: models.OrgMembership,
	foreignKey: "users_id",
	otherKey: "org_id",
});

models.User.hasMany(models.OrgMembership, { foreignKey: "users_id" });
models.OrgMembership.belongsTo(models.User, { foreignKey: "users_id" });

models.Organization.hasMany(models.OrgMembership, { foreignKey: "org_id" });
models.OrgMembership.belongsTo(models.Organization, { foreignKey: "org_id" });

// OrgMembership to Roles (Many-to-Many)
models.OrgMembership.belongsToMany(models.OrganizationRole, {
	through: models.OrgRoleRelationship,
	foreignKey: "assignment_id",
	otherKey: "role_id",
	as: "assignedRoles",
});

models.OrganizationRole.belongsToMany(models.OrgMembership, {
	through: models.OrgRoleRelationship,
	foreignKey: "role_id",
	otherKey: "assignment_id",
});

// Organization to Schedules (One-to-Many)
models.Organization.hasMany(models.Schedule, { foreignKey: "org_id" });
models.Schedule.belongsTo(models.Organization, { foreignKey: "org_id" });

// Shows to Users (Many-to-Many)
models.Show.belongsToMany(models.User, {
	through: models.ShowMembership,
	foreignKey: "show_id",
	otherKey: "users_id",
});
models.User.belongsToMany(models.Show, {
	through: models.ShowMembership,
	foreignKey: "users_id",
	otherKey: "show_id",
});

models.User.hasMany(models.ShowMembership, { foreignKey: "users_id" });
models.ShowMembership.belongsTo(models.User, { foreignKey: "users_id" });

models.Show.hasMany(models.ShowMembership, { foreignKey: "show_id" });
models.ShowMembership.belongsTo(models.Show, { foreignKey: "show_id" });

// ShowMembership to Roles (Many-to-Many)
models.ShowMembership.belongsToMany(models.ShowRole, {
	through: models.ShowRoleRelationship,
	foreignKey: "assignment_id",
	otherKey: "role_id",
	as: "assignedRoles",
});

models.ShowRole.belongsToMany(models.ShowMembership, {
	through: models.ShowRoleRelationship,
	foreignKey: "role_id",
	otherKey: "assignment_id",
});

// Object.values(models).forEach((model) => {
// 	if (typeof model.associate === "function") {
// 		model.associate(models);
// 	}
// });

export default models;
