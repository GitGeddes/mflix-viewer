// Reference from official MongoDB tutorial:
// https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial

import { MongoClient } from 'mongodb'

const connectionString = process.env.MONGO_URI || ''
const client = new MongoClient(connectionString)

let conn
try {
  console.log('Server successfully connected to MongoDB.')
  conn = await client.connect()
} catch (e) {
  console.error('Server failed to connect to MongoDB', e)
}

// Force expect to have a connection object.
let db = conn!.db('sample_mflix')
export default db
