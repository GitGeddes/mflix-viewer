import axios from 'axios'
const API_URL = 'http://localhost:3000/'

export async function getIndex() {
  try {
    const response = await axios.get(API_URL)
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}

export async function getUsers() {
  try {
    const response = await axios.get(API_URL + 'users')
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}

export async function getMoviesTest() {
  try {
    const response = await axios.get(API_URL + 'movies/test')
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getMovieById(id: string) {
  try {
    const response = await axios.get(API_URL + `movies/${id}`)
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}
