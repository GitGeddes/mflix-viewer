import axios from 'axios'
const API_URL = 'http://localhost:3000/api/'

export interface Movie {
  _id: string
  awards: {
    nominations: number
    text: string
    wins: number
  }
  cast: Array<string>
  countries: Array<string>
  directors: Array<string>
  fullPlot?: string
  genres: Array<string>
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

export async function getAllMovies(): Promise<Movie[] | null> {
  return requestFactory<Movie[]>(API_URL + 'movies')
}

export async function getMoviesByPage(page: number): Promise<Movie[] | null> {
  return requestFactory<Movie[]>(API_URL + `movies/page/${page}`)
}

export async function getMovieById(id: string): Promise<Movie | null> {
  return requestFactory<Movie>(API_URL + `movies/${id}`)
}

export async function getMaxRuntime() {
  return requestFactory(API_URL + 'movies/aggregate/runtime')
}

export async function getMaxRuntimeByType() {
  return requestFactory(API_URL + 'movies/aggregate/runtimeByType')
}

export async function getDistinctRateds() {
  return requestFactory(API_URL + 'movies/aggregate/rated')
}

async function requestFactory<T>(url: string): Promise<T | null> {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}
