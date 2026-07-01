import { describe, it, expect, vi, afterEach } from 'vitest'
import { api, getAllMovies, type Movie } from '@/services/api'
import MockAdapter from 'axios-mock-adapter'

describe('getAllMovies', () => {
  const mockAPI = new MockAdapter(api)

  const BASE_URL = 'http://localhost:3000'
  const API_URL = 'http://localhost:3000/api/'
  const MOCK_MOVIES_URL = API_URL + 'movies'

  // Helper function to create mock movie data
  function createMockMovie(): Movie {
    return {
      _id: 'movie123',
      title: 'Test Movie',
      year: 2026,
      cast: ['Actor1', 'Actor2'],
      genres: ['Action', 'Drama'],
      // ... other mock fields as needed
    } as Movie
  }

  afterEach(() => {
    mockAPI.reset()
  })

  it('should return movies array on successful request', async () => {
    const mockResponse = { data: [createMockMovie(), createMockMovie()] }
    mockAPI.onGet(MOCK_MOVIES_URL).reply(200, mockResponse)

    const result = await getAllMovies()

    expect(result).toEqual({ data: [createMockMovie(), createMockMovie()] })
    // expect(mock).toHaveBeenCalledWith(MOCK_MOVIES_URL)
  })

  it('should return null when network request fails', async () => {
    mockAPI.onGet(MOCK_MOVIES_URL).networkError()

    const result = await getAllMovies()

    expect(result).toBeNull()
  })

  it('should return null on 404 Not Found', async () => {
    mockAPI.onGet(MOCK_MOVIES_URL).reply(404, {})

    const result = await getAllMovies()

    expect(result).toBeNull()
  })

  it('should return null on 500 Server Error', async () => {
    mockAPI.onGet(MOCK_MOVIES_URL).reply(500, {})

    const result = await getAllMovies()

    expect(result).toBeNull()
  })

  it('should return null on 401 Unauthorized', async () => {
    mockAPI.onGet(MOCK_MOVIES_URL).reply(401, {})

    const result = await getAllMovies()

    expect(result).toBeNull()
  })

  it('should handle empty movies array from API', async () => {
    const mockResponse = { data: [] }
    mockAPI.onGet(MOCK_MOVIES_URL).reply(200, mockResponse)

    const result = await getAllMovies()

    expect(result).toEqual({ data: [] })
  })
})
