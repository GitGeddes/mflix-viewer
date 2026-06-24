import express from 'express'
import db from '../src/dbConnection.ts'
import { ObjectId, type Sort } from 'mongodb'

const PAGE_LIMIT = 50

const SORT_TITLE: Sort = {
  title: 1,
}

var router = express.Router()

/** GET movies home page. */
router.get('/', async function (req, res, next) {
  let collection = await db.collection('movies')
  let results = await collection.find().sort(SORT_TITLE).toArray()
  res.status(200).send(results)
})

// TODO: Pagination is unused
/** GET specific page of movies. */
router.get('/page/:page', async function (req, res, next) {
  // Make sure the page is always at least 1
  const page = Math.max(parseInt(req.params.page as string, 10) || 1, 1)
  // Zero-based offset for the first element on the page.
  const offset = (page - 1) * PAGE_LIMIT

  let collection = await db.collection('movies')
  let results = await collection.find().sort(SORT_TITLE).limit(PAGE_LIMIT).skip(offset).toArray()
  res.status(200).send(results)
})

/** GET movie by id. */
router.get('/:id', async function (req, res, next) {
  let collection = await db.collection('movies')
  // Match by the requested ID
  let query = { _id: new ObjectId(req.params.id) }
  let result = await collection.findOne(query)
  if (!result) res.status(404).send('Movie not found')
  else res.status(200).send(result)
})

/** GET maximum and minimum of the release year across the Movies collection */
router.get('/aggregate/year', async function (req, res, next) {
  let collection = db.collection('movies')
  let query = {
    $group: {
      _id: {}, // Groups all documents together regardless of any field
      maxYear: { $max: '$year' },
      minYear: { $min: '$year' },
    },
  }
  let aggregate = await collection.aggregate([query]).toArray()
  res.status(200).send(aggregate[0])
})

/** GET maximum and minimum of the runtime across the Movies collection */
router.get('/aggregate/runtime', async function (req, res, next) {
  let collection = db.collection('movies')
  let query = {
    $group: {
      _id: {}, // Groups all documents together regardless of any field
      maxRuntime: { $max: '$runtime' },
      minRuntime: { $min: '$runtime' },
    },
  }
  let aggregate = await collection.aggregate([query]).toArray()
  res.status(200).send(aggregate[0])
})

/** GET maximum and minimum of the runtime across the Movies collection, grouped by type */
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
  res.status(200).send(minMaxObj)
})

/** GET all distinct values for the Rated field */
router.get('/aggregate/rated', async function (req, res, next) {
  let collection = db.collection('movies')
  const cursor = await collection.distinct('rated')
  res.status(200).send(cursor)
})

/** GET all distinct values for the Genres field */
router.get('/aggregate/genre', async function (req, res, next) {
  let collection = db.collection('movies')
  const aggregate = await collection
    .aggregate([
      { $unwind: '$genres' }, // Unwind nested genre array
      { $group: { _id: null, distinctGenres: { $addToSet: '$genres' } } },
    ])
    .toArray()
  res.status(200).send(aggregate[0].distinctGenres)
})

/** GET maximum and minimum of the IMDB rating across the Movies collection */
router.get('/aggregate/imdb', async function (req, res, next) {
  let collection = db.collection('movies')
  const aggregate = await collection
    .aggregate([
      {
        $group: {
          _id: null,
          maxIMDBRating: { $max: '$imdb.rating' },
          minIMDBRating: { $min: '$imdb.rating' },
        },
      },
    ])
    .toArray()
  res.status(200).send(aggregate[0])
})

/** POST fetch list of movies by IDs */
router.post('/', async function (req, res, next) {
  let collection = db.collection('movies')
  try {
    // Need to ensure the IDs are proper MongoDB ObjectIds
    const query = { _id: { $in: req.body.movies.map((val) => new ObjectId(val)) } }
    const result = await collection.find(query).toArray()
    res.status(200).json({ movies: result })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
