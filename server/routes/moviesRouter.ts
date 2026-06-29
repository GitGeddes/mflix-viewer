import express from 'express'
import db from '../src/dbConnection.ts'
import { ObjectId, type Sort } from 'mongodb'

const PAGE_LIMIT = 50

const SORT_TITLE: Sort = {
  title: 1,
}

var router = express.Router()

export interface Movie {
  awards: {
    nominations: number
    text: string
    wins: number
  }
  cast: Array<string>
  countries: Array<string>
  directors: Array<string>
  fullPlot?: string
  genres?: Array<string>
  imdb: {
    id: number
    rating: number
    votes: number
  }
  languages: Array<string>
  lastupdated: string
  num_mflix_comments: number
  plot: string
  poster?: string
  rated?: string
  released: Date
  runtime: number
  title: string
  tomatoes: {
    boxOffice?: string
    consensus?: string
    critic?: {
      meter: number
      numReviews: number
      rating: number
    }
    dvd?: Date
    fresh?: number
    lastUpdated: Date
    production?: string
    rotten?: number
    viewer: {
      meter: number
      numReviews: number
      rating: number
    }
    website?: string
  }
  type: 'movie'
  writers: Array<string>
  year: number
}

type WithWatchlist = {
  isWatchlisted?: boolean
}

export type MovieWithWatchlist = Movie & WithWatchlist

export type MoviesDictionary = {
  [id: string]: MovieWithWatchlist
}

/** GET movies home page. */
router.get('/', async function (req, res, next) {
  let collection = await db.collection<Movie>('movies')
  let results = await collection.find().sort(SORT_TITLE).toArray()
  let moviesDict: MoviesDictionary = {}
  results.forEach((movie) => {
    moviesDict[movie._id.toString()] = movie
  })
  res.status(200).send(moviesDict)
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
  let collection = await db.collection<Movie>('movies')
  // Match by the requested ID
  let query = { _id: new ObjectId(req.params.id) }
  let movieResult = await collection.findOne(query)
  if (!movieResult) {
    res.status(404).send('Movie not found')
    return
  }
  let moviesDict: MoviesDictionary = {}
  moviesDict[movieResult._id.toString()] = movieResult
  res.status(200).send(moviesDict)
})

async function getYearsAggregate() {
  let collection = db.collection('movies')
  let query = {
    $group: {
      _id: {}, // Groups all documents together regardless of any field
      maxYear: { $max: '$year' },
      minYear: { $min: '$year' },
    },
  }
  let aggregate = await collection.aggregate([query]).toArray()
  return aggregate[0]
}

async function getRuntimeAggregate() {
  let collection = db.collection('movies')
  let query = {
    $group: {
      _id: {}, // Groups all documents together regardless of any field
      maxRuntime: { $max: '$runtime' },
      minRuntime: { $min: '$runtime' },
    },
  }
  let aggregate = await collection.aggregate([query]).toArray()
  return aggregate[0]
}

async function getRuntimeAggregateByType() {
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
  return minMaxObj
}

async function getRatedAggregate() {
  let collection = db.collection('movies')
  const cursor = await collection.distinct('rated')
  return cursor
}

async function getGenreAggregate() {
  let collection = db.collection('movies')
  const aggregate = await collection
    .aggregate([
      { $unwind: '$genres' }, // Unwind nested genre array
      { $group: { _id: null, distinctGenres: { $addToSet: '$genres' } } },
    ])
    .toArray()
  return aggregate[0].distinctGenres
}

async function getImdbAggregate() {
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
  return aggregate[0]
}

async function getAllAggregates() {
  let yearsAggregate = await getYearsAggregate()
  let runtimeAggregate = await getRuntimeAggregate()
  let ratedAggregate = await getRatedAggregate()
  let genreAggregate = await getGenreAggregate()
  let imdbAggregate = await getImdbAggregate()
  return {
    yearsAggregate,
    runtimeAggregate,
    ratedAggregate,
    genreAggregate,
    imdbAggregate,
  }
}

/** GET all aggregates for each field */
router.get('/aggregate/all', async function (req, res, next) {
  let aggregates = await getAllAggregates()
  res.status(200).send(aggregates)
})

// Unused
/** GET maximum and minimum of the release year across the Movies collection */
router.get('/aggregate/year', async function (req, res, next) {
  let yearsAggregate = await getYearsAggregate()
  res.status(200).send(yearsAggregate)
})

// Unused
/** GET maximum and minimum of the runtime across the Movies collection */
router.get('/aggregate/runtime', async function (req, res, next) {
  let runtimeAggregate = await getRuntimeAggregate()
  res.status(200).send(runtimeAggregate)
})

// Unused
/** GET maximum and minimum of the runtime across the Movies collection, grouped by type */
router.get('/aggregate/runtimeByType', async function (req, res, next) {
  const minMaxObj = await getRuntimeAggregateByType()
  res.status(200).send(minMaxObj)
})

// Unused
/** GET all distinct values for the Rated field */
router.get('/aggregate/rated', async function (req, res, next) {
  let ratedAggregate = await getRatedAggregate()
  res.status(200).send(ratedAggregate)
})

// Unused
/** GET all distinct values for the Genres field */
router.get('/aggregate/genre', async function (req, res, next) {
  let genreAggregate = await getGenreAggregate()
  res.status(200).send(genreAggregate)
})

// Unused
/** GET maximum and minimum of the IMDB rating across the Movies collection */
router.get('/aggregate/imdb', async function (req, res, next) {
  let imdbAggregate = await getImdbAggregate()
  res.status(200).send(imdbAggregate)
})

/** POST fetch list of movies by IDs */
router.post('/', async function (req, res, next) {
  let collection = db.collection<Movie>('movies')
  try {
    // Need to ensure the IDs are proper MongoDB ObjectIds
    const query = { _id: { $in: req.body.movies.map((val: string) => new ObjectId(val)) } }
    const result = await collection.find(query).toArray()
    res.status(200).json({ movies: result })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
