import express from "express";
import db from "../src/dbConnection.ts";

var router = express.Router();

/* GET movies listing. */
router.get("/", function (req, res, next) {
  res.send("movies endpoint");
});

router.get("/test", async function (req, res, next) {
  let collection = await db.collection("movies");
  let results = await collection.find({}).limit(50).toArray();
  res.send(results).status(200);
});

/* GET movie by id. */
router.get("/:[id]", function (req, res, next) {
  res.send(`movie with id ${req.params.id}`);
});

export default router;
