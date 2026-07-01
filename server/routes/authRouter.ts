// Express example auth system:
// https://github.com/expressjs/express/tree/master/examples/auth
import db from '../src/dbConnection.ts'
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticateToken } from './middleware/authMiddleware.ts'
import { ObjectId } from 'mongodb'

const secret: string = process.env.JWT_TOKEN!

var router = express.Router()

// POST create user request
router.post('/createUser', async function (req, res) {
  const { displayname, username, email, password } = req.body
  let collection = await db.collection('users')

  try {
    // Generate a password hash with 10 rounds
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await collection.insertOne({
      displayname: displayname,
      username: username,
      email: email,
      password: passwordHash,
    })
    res.status(200).json({ user: user })
  } catch (error) {
    // User already exists
    res.status(401).send(null)
  }
})

// Partially AI coded, had to clean it up
// PUT login request
router.put('/login', async function (req, res) {
  const { email, password } = req.body
  let collection = await db.collection('users')

  try {
    // Find user
    const query = { email: email }
    const user = await collection.findOne(query)

    // User either doesn't exist or the login credentials were wrong.
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    // Verify password hash (never use simple string comparison)
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: '7d' })

    res.status(200).json({
      token,
      expiresIn: '7d',
      user: {
        id: user._id,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Middleware
// Must be used after the createUser and login endpoints.
// The resulting User object in the request is use to verify ownership of
// other documents like the Watchlist or the Ratings list.
router.use(async function (req, res, next) {
  await authenticateToken(req, res, next)
})

// GET own user's information
router.get('/me', async function (req, res) {
  let collection = await db.collection('users')
  try {
    // The user should be added by the middleware if the token is valid
    const query = { _id: new ObjectId(req.user.userId) }
    const user = await collection.findOne(query)

    res.status(200).json({ user: user })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST fetch user by ID
router.post('/user', async function (req, res) {
  const { userID } = req.body
  let collection = await db.collection('users')
  try {
    const query = { _id: new ObjectId(userID) }
    const user = await collection.findOne(query)

    res.status(200).json({ user: user })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/logout', async function (req, res) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  let collection = await db.collection('token_denylist')

  try {
    // Make sure only the current user can invalidate their own tokens
    const denyEntry = await collection.insertOne({
      token: token,
      exp: req.user.exp, // Save expiration timestamps to potentially delete later
    })
    req.session.destroy(() => {
      console.debug('session destroyed')
    })
    res.status(200).json({ message: 'You are logged out!', ok: true })
  } catch (error) {
    // User already exists
    res.status(500).send({ error: 'Internal server error' })
  }
})

// POST favorite genres to collection
router.post('/favoriteGenres', async function (req, res) {
  let collection = await db.collection('favorite_genres')
  try {
    const query = { _id: new ObjectId(req.user.userId) }
    const update = { $set: req.body }
    const options = { upsert: true } // Enable upsert (insert when doc doesn't exist)
    collection.updateOne(query, update, options)
    res.status(200).json({ message: 'success' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET favorite genres from collection
router.get('/favoriteGenres', async function (req, res) {
  let collection = await db.collection('favorite_genres')
  try {
    const query = { _id: new ObjectId(req.user.userId) }
    const genres = await collection.findOne(query)
    res.status(200).json(genres)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/addToWatchlist', async function (req, res) {
  let collection = await db.collection('watchlists')
  try {
    const query = { _id: new ObjectId(req.user.userId) }
    const existing = await collection.findOne(query)
    if (existing) {
      // Need to update existing document
      collection.updateOne(query, { $addToSet: { movies: { $each: req.body.movies } } })
      res.status(200).json({ message: 'success' })
    } else {
      // Create document
      const result = await collection.insertOne({ ...query, ...req.body })
      res.status(200).json({ message: 'success' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/removeFromWatchlist', async function (req, res) {
  let collection = await db.collection('watchlists')
  try {
    const query = { _id: new ObjectId(req.user.userId) }
    const existing = await collection.findOne(query)
    if (existing) {
      // Need to update existing document
      collection.updateOne(query, { $pull: { movies: { $in: req.body.movies } } })
      res.status(200).json({ message: 'success' })
    } else {
      // Create document for the user with an empty watchlist
      const result = await collection.insertOne({ ...query, movies: [] })
      res.status(200).json({ message: 'success' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET watchlist from collection
router.get('/watchlist', async function (req, res) {
  let collection = await db.collection('watchlists')
  try {
    const query = { _id: new ObjectId(req.user.userId) }
    const existing = await collection.findOne(query)
    res.status(200).json({ watchlist: existing })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/addRating', async function (req, res) {
  let collection = await db.collection('ratings')
  try {
    const query = { _id: new ObjectId(req.user.userId) }
    const existing = await collection.findOne(query)
    if (existing) {
      // Need to update existing document
      collection.updateOne(query, {
        $set: { [`ratings.${req.body.rating.id}`]: req.body.rating.rating },
      })
      res.status(200).json({ message: 'success' })
    } else {
      // Create document
      console.log('add rating requset', req.body)
      const result = await collection.insertOne({
        ...query,
        ratings: {
          [`${req.body.rating.id}`]: req.body.rating.rating,
        },
      })
      res.status(200).json({ message: 'success' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/deleteRating', async function (req, res) {
  let collection = await db.collection('ratings')
  try {
    const query = { _id: new ObjectId(req.user.userId) }
    const existing = await collection.findOne(query)
    if (existing) {
      // Need to update existing document
      collection.updateOne(query, { $unset: { ratings: { $in: req.body.movies } } })
      res.status(200).json({ message: 'success' })
    } else {
      // Create document
      const result = await collection.insertOne({ ...query, ratings: {} })
      res.status(200).json({ message: 'success' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET watchlist from collection
router.get('/ratings', async function (req, res) {
  let collection = await db.collection('ratings')
  try {
    const query = { _id: new ObjectId(req.user.userId) }
    const existing = await collection.findOne(query)
    res.status(200).json({ ratings: existing })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
