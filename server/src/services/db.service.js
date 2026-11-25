/**
 * The shared Sequelize connection.
 *
 * @remarks
 * Default-exports a `Sequelize` instance built from `databaseConfig`, which
 * reads `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` and
 * `DB_DIALECT` from the environment. Importing this module creates the
 * connection pool; services use it to open transactions.
 */

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
		logging: databaseConfig.logging,
	},
);

export default sequelize;
