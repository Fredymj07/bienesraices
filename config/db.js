import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5, /* Número máximo de conexiones por usuario */
        min: 0, /* número de mínimo de conexiones por usuario */
        acquire: 30000, /* Timpo máximo que tendrá una conexión antes de marcarse un error */
        idle: 10000 /* Tiempo máximo permitido para que se pueda cerrar una conexión por inactividad */
    }
});

export default db;