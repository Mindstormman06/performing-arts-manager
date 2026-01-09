import { DataTypes } from "sequelize";
import UserModel from './User.js';
import sequelize from "../services/db.service.js";

const models = {
    User: UserModel(sequelize, DataTypes)
};

Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
        model.associate(models);
    }
});

export default models;