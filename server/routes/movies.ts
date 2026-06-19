import express from "express";
import db from "../src/dbConnection.ts";
import mongodb, { ObjectId } from "mongodb";

const PAGE_LIMIT = 50;

var router = express.Router();

/* GET movies home page. */
router.get("/", function (req, res, next) {
  res.send("movies endpoint");
});

/* GET first page of movies. */
router.get("/test", async function (req, res, next) {
  const sort: mongodb.Sort = {
    title: -1,
  };

  let collection = await db.collection("movies");
  let results = await collection
    .find({})
    .sort(sort)
    .limit(PAGE_LIMIT)
    .toArray();
  res.send(results).status(200);
});

/* GET specific page of movies. */
router.get("/page/:page", async function (req, res, next) {
  // Make sure the page is always at least 1
  const page = Math.max(parseInt(req.params.page as string, 10) || 1, 1);
  // Zero-based offset for the first element on the page.
  const offset = (page - 1) * PAGE_LIMIT;
  const sort: mongodb.Sort = {
    title: -1,
  };

  let collection = await db.collection("movies");
  let results = await collection
    .find()
    .sort(sort)
    .limit(PAGE_LIMIT)
    .skip(offset)
    .toArray();
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
