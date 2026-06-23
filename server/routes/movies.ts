import express from 'express'
import db from '../src/dbConnection.ts'
import { ObjectId, type Sort } from 'mongodb'

const PAGE_LIMIT = 50

var router = express.Router()

/* GET movies home page. */
router.get('/', async function (req, res, next) {
  const sort: Sort = {
    title: 1,
  }

  let collection = await db.collection('movies')
  let results = await collection.find().sort(sort).toArray()
  res.send(results).status(200)
})

/* GET specific page of movies. */
router.get('/page/:page', async function (req, res, next) {
  // Make sure the page is always at least 1
  const page = Math.max(parseInt(req.params.page as string, 10) || 1, 1)
  // Zero-based offset for the first element on the page.
  const offset = (page - 1) * PAGE_LIMIT
  const sort: Sort = {
    title: 1,
  }

  let collection = await db.collection('movies')
  let results = await collection.find().sort(sort).limit(PAGE_LIMIT).skip(offset).toArray()
  res.send(results).status(200)
})

/* GET movie by id. */
router.get('/:id', async function (req, res, next) {
  let collection = await db.collection('movies')
  let query = { _id: new ObjectId(req.params.id) }
  let result = await collection.findOne(query)
  if (!result) res.send('Movie not found').status(404)
  else res.send(result).status(200)
})

/* GET maximum and minimum of the runtime across the Movies collection */
router.get('/aggregate/runtime', async function (req, res, next) {
  let collection = db.collection('movies')
  let query = {
    $group: {
      _id: {},
      maxRuntime: { $max: '$runtime' },
      minRuntime: { $min: '$runtime' },
    },
  }
  let aggregate = collection.aggregate([query])
  const aggregateArray = await aggregate.toArray()
  res.send(aggregateArray[0]).status(200)
})

/* GET maximum and minimum of the runtime across the Movies collection, grouped by type */
router.get('/aggregate/runtimeByType', async function (req, res, next) {
  let collection = db.collection('movies')
  let query = {
    $group: {
      _id: '$type', // Groups by 'series' and 'movie'
      maxRuntime: { $max: '$runtime' },
      minRuntime: { $min: '$runtime' },
    },
  }
  let aggregate = await collection.aggregate([query]).toArray()
  // const aggregateArray = await aggregate.toArray()
  // Reduce the array into one object dictionary with they keys "movie" and "series"
  const minMaxObj = Object.entries(aggregate)
    .map((val) => {
      const obj = val[1]
      return {
        [obj._id as string]: {
          maxRuntime: obj.maxRuntime,
          minRuntime: obj.minRuntime,
        },
      }
    })
    .reduce((prev, curr) => {
      prev[Object.keys(curr)[0]] = Object.values(curr)[0]
      return prev
    })
  res.send(minMaxObj).status(200)
})

export default router
