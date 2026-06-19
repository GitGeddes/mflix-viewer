import axios from 'axios'
const API_URL = 'http://localhost:3000/api/'

export interface Movie {
  _id: String
  awards: {
    nominations: Number
    text: String
    wins: Number
  }
  cast: Array<String>
  countries: Array<String>
  directors: Array<String>
  fullPlot?: String
  genres: Array<String>
  imdb: {
    id: Number
    rating: Number
    votes: Number
  }
  languages: Array<String>
  lastupdated: String
  num_mflix_comments: Number
  plot: String
  poster?: String
  rated?: String
  released: Date
  runtime: Number
  title: String
  tomatoes: {
    boxOffice?: String
    consensus?: String
    critic?: {
      meter: Number
      numReviews: Number
      rating: Number
    }
    dvd?: Date
    fresh?: Number
    lastUpdated: Date
    production?: String
    rotten?: Number
    viewer: {
      meter: Number
      numReviews: Number
      rating: Number
    }
    website?: string
  }
  type: 'movie'
  writers: Array<String>
  year: Number
}

export async function getAllMovies(): Promise<Movie[] | null> {
  try {
    const response = await axios.get(API_URL + 'movies')
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getMoviesByPage(page: number): Promise<Movie[] | null> {
  try {
    const response = await axios.get(API_URL + `movies/page/${page}`)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getMovieById(id: string): Promise<Movie | null> {
  try {
    const response = await axios.get(API_URL + `movies/${id}`)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}
