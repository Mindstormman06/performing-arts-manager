import { Sequelize } from "sequelize";
import { databaseConfig } from "../config/index.js";

const sequelize = new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password,
    {
        host: databaseConfig.host,
        port: databaseConfig.port,
        dialect: databaseConfig.dialect,
        logging: databaseConfig.logging
    }
);

export default sequelize;