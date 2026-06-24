// Express example auth system:
// https://github.com/expressjs/express/tree/master/examples/auth
import db from '../src/dbConnection.ts'
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
    res.json({ user: user }).status(200)
  } catch (error) {
    // User already exists
    res.status(401).send(null)
  }
})

// Partially AI coded, had to clean it up
// POST login request
router.post('/login', async function (req, res) {
  console.log('login request', req.body)

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

    res
      .json({
        token,
        expiresIn: '7d',
        user: {
          id: user._id,
          email: user.email,
        },
      })
      .status(200)
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/user', async function (req, res) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log('reeee', token)

  if (!token) {
    return res.status(401).json({ message: 'Token missing' })
  }

  jwt.verify(token, process.env.JWT_TOKEN!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }

    // req.user = decoded
    console.log('decoded user?', decoded)
    res.status(200).json({ user: decoded })
  })
})

export default router
