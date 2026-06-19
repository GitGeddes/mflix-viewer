# Mflix Viewer

This test is a practice project to learn Vue, Express and MongoDB. There are two parts of this project: the client and the server.

## Requirements

### MongoDB

To install a local instance of MongoDB, install MongoDB Community Edition [MongoDB Community Edition](https://www.mongodb.com/products/self-managed/community-edition), which should include [MongoDB Compass](https://www.mongodb.com/products/tools/compass), the desktop program to manage the MongoDB instance.

Download the sample data from MongoDB:

```sh
curl  https://atlas-education.s3.amazonaws.com/sampledata.archive -o sampledata.archive
```

Load the MongoDB sample data using the [MongoDB CLI tools](https://www.mongodb.com/try/download/database-tools):

```sh
mongorestore --archive=sampledata.archive --port=<port-number>
```

Where `<port-number>` is the port of the MongoDB instance.

Reference [docs](https://www.mongodb.com/docs/atlas/sample-data/load-sample-data-local/).

## Installation

Both the client and the server have their own installation requirements so refer to those README's for specific instructions

## Architecture

The front-end client is built using Vue, Vite, Vuetify and Axios, with Vitest and Playwright testing.

The back-end server is built using Express.js and Node.js and connects directly with a local MongoDB database instance.

Both systems were primarily written using TypeScript with ESLint and Prettier for linting and formatting.
