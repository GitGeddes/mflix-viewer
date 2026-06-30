import db from '../../src/dbConnection.ts'
import jwt from 'jsonwebtoken'

interface UserInterface {
  id: string
  email: string
}

export interface WithAuthMiddleware {
  user: UserInterface
}

interface WithMessage {
  message?: string
  error?: string
}

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token missing' })
  }

  // Ensure the token is not already denylisted (logged out)
  let collection = await db.collection('token_denylist')
  try {
    const denylistEntry = await collection.findOne({ token: token })
    if (denylistEntry) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error (token not denylisted)' })
  }

  // Verify the token and return the encoded user object
  jwt.verify(token, process.env.JWT_TOKEN!, (err, decoded) => {
    // Ensure the token is not expired
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }

    // Reassign the decoded user object
    req.user = decoded as UserInterface
    next()
  })
}
