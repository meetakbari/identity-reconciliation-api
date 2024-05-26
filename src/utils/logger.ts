import winston, { format } from "winston";

const options: winston.LoggerOptions = {
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(log => `${log.timestamp} ${log.level}: ${log.message}`+(log.splat!==undefined?`${log.splat}`:" ")) 
    ),
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === "production" ? "error" : "debug"
        }),
        new winston.transports.File({ 
            dirname: 'logs', 
            filename: "debug.log", 
            level: 'debug', 
            maxsize: 10000000, // 10 MB
            maxFiles: 10 
        }),
    ]
};

const logger = winston.createLogger(options);

export default logger;