import errorHandler from "errorhandler";
import app from "./app";
import { ENVIRONMENT } from "./utils/secrets";
import { AppDataSource } from "./db/data-source";
import logger from "./utils/logger";

// Error Handler. Provides full stack trace
if (ENVIRONMENT === "development") {
    app.use(errorHandler());
}

// Connect to Database
AppDataSource.initialize()
    .then(() => {
        logger.info("Database connected successfully!");
    })
    .catch((error) => {
        logger.error("Error while connecting to database: ", error);
    });

// Start Express server.
const server = app.listen(app.get("port"), () => {
    console.log(
        "App is running at port %d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("\n  Press Ctrl+C to stop\n");
});

export default server;