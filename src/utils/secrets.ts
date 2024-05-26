import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.info("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.info("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}

// Function to validate required environment variables
const getEnvVar = (varName: string): string => {
  const value = process.env[varName];
  if (!value) {
    logger.error(`No ${varName} environment variable. Set ${varName} environment variable.`);
  }
  return value;
};

export const ENVIRONMENT = process.env["NODE_ENV"];
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const PORT = getEnvVar("PORT");

// Retrieve and validate all required environment variables
export const POSTGRES_DB_HOST = getEnvVar('POSTGRES_DB_HOST');
export const POSTGRES_DB_PORT = getEnvVar('POSTGRES_DB_PORT');
export const POSTGRES_DB_USERNAME = getEnvVar('POSTGRES_DB_USERNAME');
export const POSTGRES_DB_PASSWORD = getEnvVar('POSTGRES_DB_PASSWORD');
export const POSTGRES_DB_NAME = getEnvVar('POSTGRES_DB_NAME');
