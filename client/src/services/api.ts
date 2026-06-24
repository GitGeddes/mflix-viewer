import axios from 'axios'
const BASE_URL = 'http://localhost:3000'
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

interface LoginBody {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  expiresIn: string
  user: {
    email: string
    id: string
  }
}

interface CreateUserBody {
  displayname?: string
  username: string
  email: string
  password: string
}

interface GetUserBody {
  userID: string
}

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

export async function getAllMovies(): Promise<Movie[] | null> {
  return getRequestFactory<Movie[]>(API_URL + 'movies')
}

export async function getMoviesByPage(page: number): Promise<Movie[] | null> {
  return getRequestFactory<Movie[]>(API_URL + `movies/page/${page}`)
}

export async function getMovieById(id: string): Promise<Movie | null> {
  return getRequestFactory<Movie>(API_URL + `movies/${id}`)
}

export async function getMaxRuntime() {
  return getRequestFactory(API_URL + 'movies/aggregate/runtime')
}

export async function getMaxRuntimeByType() {
  return getRequestFactory(API_URL + 'movies/aggregate/runtimeByType')
}

export async function getDistinctRateds() {
  return getRequestFactory(API_URL + 'movies/aggregate/rated')
}

export async function postCreateUser(body: CreateUserBody) {
  return postRequestFactory<CreateUserBody, unknown>(API_URL + 'user/createUser', body)
}

export async function postLogin(body: LoginBody) {
  const response = await postRequestFactory<LoginBody, LoginResponse>(API_URL + 'user/login', body)
  if (response) {
    localStorage.setItem('access_token', response.token)
  }
  return response
}

export async function postGetUser(body: GetUserBody) {
  const response = await postRequestFactory<GetUserBody, unknown>(API_URL + 'user/user', body)
  if (response) {
    console.log('get user response', response)
  }
  return response
}

async function getRequestFactory<T>(url: string): Promise<T | null> {
  try {
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

async function postRequestFactory<T, V>(url: string, body: T): Promise<V | null> {
  try {
    const response = await api.post(url, body)
    return response.data
  } catch (error) {
    console.error('Error in POST request:', error)
    return null
  }
}
