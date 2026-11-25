/**
 * Sequelize connection settings read from environment variables.
 *
 * @remarks
 * Exports `databaseConfig`, built from `DB_USER`, `DB_PASSWORD`, `DB_NAME`,
 * `DB_HOST`, `DB_PORT`, `DB_DIALECT` and `DB_SSL`. Without them it targets a
 * local MySQL database named `performing-arts-manager-db` as `root` with no
 * password. Query logging is off and table names are not pluralized.
 */

export const databaseConfig = {
	username: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "performing-arts-manager-db",
	host: process.env.DB_HOST || "127.0.0.1",
	port: process.env.DB_PORT || 3306,
	dialect: process.env.DB_DIALECT || "mysql",
	sslEnabled: process.env.DB_SSL || false,
	logging: false,
	define: {
		freezeTableName: true,
	},
};
