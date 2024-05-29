import "reflect-metadata";
import { DataSource } from "typeorm";
import { Contact } from "./models/Contact";
import { 
    POSTGRES_DB_HOST,
    POSTGRES_DB_PORT,
    POSTGRES_DB_USERNAME,
    POSTGRES_DB_PASSWORD,
    POSTGRES_DB_NAME 
} from "../utils/secrets";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: POSTGRES_DB_HOST,
  port: parseInt(POSTGRES_DB_PORT),
  username: POSTGRES_DB_USERNAME,
  password: POSTGRES_DB_PASSWORD,
  database: POSTGRES_DB_NAME,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false
  },
  logging: false,
  entities: [Contact],
  migrations: [],
});