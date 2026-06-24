import db from '../../src/dbConnection.ts'

// AI coded
import User from './models/User.ts'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

import dotenv from 'dotenv'
dotenv.config()

const secret: string = process.env.JWT_SECRET!

// POST login request
export async function login(req: Request, res: Response) {
  const { username, password } = req.body

  try {
    // Find user
    const user = await User.findOne({ username }).select('+passwordHash')

    // User either doesn't exist or the login credentials were wrong.
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    // Verify password hash (never use simple string comparison)
    const isValidPassword = bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, secret, {
      expiresIn: '7d',
    })

    res.json({
      token,
      expiresIn: '7d',
      user: {
        id: user._id,
        username: user.username,
        email: user.email || null,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
}
