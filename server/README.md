# Mflix Viewer Server

This is the Express.js REST API for my sample Mflix movie viewer.

## Setup

### 0. Prerequisites

Copy the `.env.sample` file and rename it to `.env`. Fill in the `MONGO_URI` and the `PORT` so that the server is set up correctly. Paste in the MongoDB connection string from your instance. The `PORT` should be the port that the server listens for HTTP requests on, not the MongoDB port.

Make sure the MongoDB instance is already running either locally through MongoDB Compass or in the cloud.

### 1. Install dependencies

```sh
npm install
```

### 2. Start the server

```sh
npm run start
```

This starts the server at `http://localhost:3000/`

## Template

I initially created this server with the `express-generator` template shown in the [docs](https://expressjs.com/en/5x/starter/generator/).

```sh
npx express-generator --no-view --git
```
