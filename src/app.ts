import express from "express";
import bodyParser from "body-parser";
import { PORT } from "./utils/secrets";

const app = express();

app.set("port", PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

export default app;