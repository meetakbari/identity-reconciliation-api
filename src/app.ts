import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables from .env file 

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export default app;