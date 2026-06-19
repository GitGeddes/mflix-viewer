// Load env variables
import "./src/loadEnv.ts";

import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import moviesRouter from "./routes/movies.ts";

var app = express();
app.use(cors());

app.use(logger("dev"));
// Limit JSON response sizes in case of very large movie objects.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("./public"));

app.use("/api/movies", moviesRouter);

export default app;
