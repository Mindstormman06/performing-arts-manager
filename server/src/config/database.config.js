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
    }
}
