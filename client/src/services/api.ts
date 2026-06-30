import axios from 'axios'
const BASE_URL = 'http://localhost:3000'
const API_URL = 'http://localhost:3000/api/'

export const TOKEN_LOCAL_STORAGE_KEY = 'access_token'
export const LOCAL_STORAGE_UPDATE_KEY = 'login-storage-key-updated'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

interface ResponseMessage {
  message: string
}

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

// Quickly make PUT requests
async function putRequestFactory<T, V>(url: string, body: T): Promise<V | null> {
  try {
    const response = await api.put(url, body)
    return response.data
  } catch (error) {
    console.error('Error in PUT request:', error)
    return null
  }
}

// Quickly make DELETE requests
async function deleteRequestFactory<T>(url: string): Promise<T | null> {
  try {
    const response = await api.delete(url)
    return response.data
  } catch (error) {
    console.error('Error in DELETE request:', error)
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

type WithWatchlist = {
  isWatchlisted?: boolean
}
type WithRating = {
  rating?: number
}

export type FullMovie = Movie & WithWatchlist & WithRating

export type MoviesDictionary = {
  [id: string]: FullMovie
}

interface YearAggregate {
  _id: Object
  maxYear: number
  minYear: number
}

interface RuntimeAggregate {
  _id: Object
  maxRuntime: number
  minRuntime: number
}

type RatedAggregate = string[]

type GenreAggregate = string[]

interface ImdbAggregate {
  _id: Object
  maxIMDBRating: number
  minIMDBRating: number
}

export interface AllAggregates {
  yearsAggregate: YearAggregate
  runtimeAggregate: RuntimeAggregate
  ratedAggregate: RatedAggregate
  genreAggregate: GenreAggregate
  imdbAggregate: ImdbAggregate
}

// Movie endpoints
export async function getAllMovies(): Promise<MoviesDictionary | null> {
  return getRequestFactory<MoviesDictionary>(API_URL + 'movies')
}

export async function getMoviesByPage(page: number): Promise<Movie[] | null> {
  return getRequestFactory<Movie[]>(API_URL + `movies/page/${page}`)
}

export async function getMovieById(id: string): Promise<MoviesDictionary | null> {
  return getRequestFactory<MoviesDictionary>(API_URL + `movies/${id}`)
}

export async function getAllAggregates(): Promise<AllAggregates | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/all')
}

// Unused
export async function getYearRange(): Promise<YearAggregate | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/year')
}

// Unused
export async function getRuntimeRange(): Promise<RuntimeAggregate | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/runtime')
}

// Unused
export async function getMaxRuntimeByType() {
  return getRequestFactory(API_URL + 'movies/aggregate/runtimeByType')
}

// Unused
export async function getDistinctRateds(): Promise<RatedAggregate | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/rated')
}

// Unused
export async function getDistinctGenres(): Promise<GenreAggregate | null> {
  return getRequestFactory(API_URL + 'movies/aggregate/genre')
}

// Unused
export async function getImdbRatingRange(): Promise<ImdbAggregate | null> {
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
    // Dispatch an event whenever the login storage key is updated
    window.dispatchEvent(
      new CustomEvent<{ storage: string | null }>(LOCAL_STORAGE_UPDATE_KEY, {
        detail: {
          storage: localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY),
        },
      }),
    )
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
  // Dispatch an event whenever the login storage key is updated
  window.dispatchEvent(
    new CustomEvent<{ storage: string | null }>(LOCAL_STORAGE_UPDATE_KEY, {
      detail: {
        storage: localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY),
      },
    }),
  )
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

interface WatchlistBody {
  movies: Movie['_id'][]
}
export async function putAddToWatchlist(body: WatchlistBody) {
  return putRequestFactory<WatchlistBody, ResponseMessage>(API_URL + 'user/addToWatchlist', body)
}

export async function postRemoveFromWatchlist(body: WatchlistBody) {
  return postRequestFactory<WatchlistBody, ResponseMessage>(
    API_URL + 'user/removeFromWatchlist',
    body,
  )
}

interface FetchWatchlistResult {
  watchlist: { _id: string; movies: string[] } | null
}
export async function getWatchlist() {
  return getRequestFactory<FetchWatchlistResult>(API_URL + 'user/watchlist')
}
type Rating = {
  id: Movie['_id']
  rating: number
}
interface RatingBody {
  rating: Rating
}
export async function putAddToRatings(body: RatingBody) {
  return putRequestFactory<RatingBody, ResponseMessage>(API_URL + 'user/addRating', body)
}

export async function postRemoveFromRatings(body: RatingBody) {
  return postRequestFactory<RatingBody, ResponseMessage>(API_URL + 'user/deleteRating', body)
}

type RatingResult = {
  [id: string]: number
}
interface FetchRatingsResult {
  ratings: { _id: string; ratings: RatingResult } | null
}
export async function getRatings() {
  return getRequestFactory<FetchRatingsResult>(API_URL + 'user/ratings')
}

interface FetchMoviesBody {
  movies: string[] // Movie IDs
}
export async function postFetchMovies(body: FetchMoviesBody) {
  return postRequestFactory<FetchMoviesBody, { movies: MoviesDictionary }>(
    API_URL + 'movies/',
    body,
  )
}
//#endregion
