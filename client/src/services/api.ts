import axios from 'axios'
const BASE_URL = 'http://localhost:3000'
const API_URL = 'http://localhost:3000/api/'

export const TOKEN_LOCAL_STORAGE_KEY = 'access_token'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

// Quickly make GET requests
async function getRequestFactory<T>(url: string): Promise<T | null> {
  try {
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error('Error in GET request:', error)
    return null
  }
}

// Quickly make POST requests
async function postRequestFactory<T, V>(url: string, body: T): Promise<V | null> {
  try {
    const response = await api.post(url, body)
    return response.data
  } catch (error) {
    console.error('Error in POST request:', error)
    return null
  }
}

//#region Movies API
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
  genres?: Array<string>
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

// Movie endpoints
export async function getAllMovies(): Promise<Movie[] | null> {
  return getRequestFactory<Movie[]>(API_URL + 'movies')
}

export async function getMoviesByPage(page: number): Promise<Movie[] | null> {
  return getRequestFactory<Movie[]>(API_URL + `movies/page/${page}`)
}

export async function getMovieById(id: string): Promise<Movie | null> {
  return getRequestFactory<Movie>(API_URL + `movies/${id}`)
}

export async function getYearRange(): Promise<{
  _id: Object
  maxYear: number
  minYear: number
} | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/year')
}

export async function getRuntimeRange(): Promise<{
  _id: Object
  maxRuntime: number
  minRuntime: number
} | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/runtime')
}

export async function getMaxRuntimeByType() {
  return getRequestFactory(API_URL + 'movies/aggregate/runtimeByType')
}

export async function getDistinctRateds(): Promise<string[] | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/rated')
}

export async function getDistinctGenres(): Promise<string[] | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/genre')
}

export async function getImdbRatingRange(): Promise<{
  _id: Object
  maxIMDBRating: number
  minIMDBRating: number
} | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/imdb')
}
//#endregion

//#region User API
interface WithDocumentId {
  _id: string
}

export interface UserInterface {
  displayname?: string
  username: string
  email: string
  password: string
}

interface UserDocument {
  user: UserInterface & WithDocumentId
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

// User endpoints
export async function postCreateUser(body: CreateUserBody) {
  return postRequestFactory<CreateUserBody, unknown>(API_URL + 'user/createUser', body)
}

export async function postLogin(body: LoginBody) {
  const response = await postRequestFactory<LoginBody, LoginResponse>(API_URL + 'user/login', body)
  if (response) {
    localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, response.token)
  }
  return response
}

export async function getSelfUser() {
  return postRequestFactory<undefined, UserDocument>(API_URL + 'user/me', undefined)
}

export async function postGetUser(body: GetUserBody) {
  const response = await postRequestFactory<GetUserBody, UserDocument>(API_URL + 'user/user', body)
  return response
}

export async function postLogout() {
  return postRequestFactory<undefined, unknown>(API_URL + 'user/logout', undefined)
}

interface SaveFavoriteGenresBody {
  genres: string[]
}
export async function postSaveFavoriteGenres(body: SaveFavoriteGenresBody) {
  return postRequestFactory<SaveFavoriteGenresBody, unknown>(API_URL + 'user/favoriteGenres', body)
}

export async function getFavoriteGenres() {
  return getRequestFactory<SaveFavoriteGenresBody & WithDocumentId>(API_URL + 'user/favoriteGenres')
}

interface AddToWatchlistBody {
  movies: Movie['_id'][]
}
export async function postAddToWatchlist(body: AddToWatchlistBody) {
  return postRequestFactory<AddToWatchlistBody, unknown>(API_URL + 'user/watchlist', body)
}

interface FetchWatchlistResult {
  watchlist: { _id: string; movies: string[] } | null
}
export async function getWatchlist() {
  return getRequestFactory<FetchWatchlistResult>(API_URL + 'user/watchlist')
}

interface FetchMoviesBody {
  movies: string[] // Movie IDs
}
export async function postFetchMovies(body: FetchMoviesBody) {
  return postRequestFactory<FetchMoviesBody, { movies: Movie[] }>(API_URL + 'movies/', body)
}
//#endregion
