import errorHandler from "errorhandler";
import app from "./app";

/**
 * Error Handler. Provides full stack trace
 */
if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        "App is running at port %d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("\n  Press Ctrl+C to stop\n");
});

export default server;