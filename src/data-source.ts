import "reflect-metadata"
import { DataSource } from "typeorm"
import { Directory } from "./entities/Directory"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "file_management",
    synchronize: true,
    logging: true,
    entities: [Directory],
    migrations: [],
    subscribers: [],
})
