import express from "express";
import db from "../src/dbConnection.ts";
import { ObjectId } from "mongodb";

var router = express.Router();

/* GET movies home page. */
router.get("/", function (req, res, next) {
  res.send("movies endpoint");
});

/* GET first page of movies. */
router.get("/test", async function (req, res, next) {
  let collection = await db.collection("movies");
  let results = await collection.find({}).limit(50).toArray();
  res.send(results).status(200);
});

/* GET movie by id. */
router.get("/:id", async function (req, res, next) {
  let collection = await db.collection("movies");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);
  if (!result) res.send("Movie not found").status(404);
  else res.send(result).status(200);
});

export default router;
