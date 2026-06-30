import { getAllAggregates, type FullMovie, type Movie } from '@/services/api'
import { computed, onMounted, ref, type Ref } from 'vue'

export default function useFilters() {
  // Search query
  const search = ref('')

  // Filter enable/disable toggles
  const enableYearFilter = ref(false)
  const enableRuntimeFilter = ref(false)
  const enableRatedFilter = ref(false)
  const enableGenreFilter = ref(false)
  const enableIMDBFilter = ref(false)
  const enablePersonalRatingFilter = ref(false)

  // Year slider
  const yearFilter: Ref<[number, number]> = ref([0, 0])
  const yearFilterOptions: Ref<[number, number]> = ref([0, 0])
  // Runtime slider
  const runtimeFilter: Ref<[number, number]> = ref([0, 0])
  const runtimeFilterOptions: Ref<[number, number]> = ref([0, 0])
  // Rated array
  const ratedFilter: Ref<number[]> = ref([])
  const ratedFilterOptions: Ref<string[]> = ref([])
  // Genre array
  const genreFilter: Ref<number[]> = ref([])
  const genreFilterOptions: Ref<string[]> = ref([])
  // IMDB rating slider
  const imdbFilter: Ref<[number, number]> = ref([0, 0])
  const imdbFilterOptions: Ref<[number, number]> = ref([0, 0])

  // Populate all filter fields
  onMounted(() => {
    getAggregates()
  })

  function boolToString(bool: boolean) {
    if (bool) return 'true'
    else return ''
  }

  // Add all the filter toggles as strings to activate the search function in
  // v-data-table without using an Array filter method on the movies list.
  const filterChanged = computed(() => {
    return (
      search.value +
      boolToString(enableGenreFilter.value) +
      boolToString(enableIMDBFilter.value) +
      boolToString(enableRatedFilter.value) +
      boolToString(enableRuntimeFilter.value) +
      boolToString(enableYearFilter.value) +
      boolToString(enablePersonalRatingFilter.value)
    )
  })

  // Get all of the aggregate values for the table filters
  async function getAggregates() {
    const result = await getAllAggregates()
    if (result) {
      const { yearsAggregate, runtimeAggregate, ratedAggregate, genreAggregate, imdbAggregate } =
        result

      yearFilterOptions.value = [yearsAggregate.minYear, yearsAggregate.maxYear]
      yearFilter.value = yearFilterOptions.value

      runtimeFilterOptions.value = [runtimeAggregate.minRuntime, runtimeAggregate.maxRuntime]
      runtimeFilter.value = runtimeFilterOptions.value

      ratedFilterOptions.value = ratedAggregate.sort()

      genreFilterOptions.value = genreAggregate.sort()

      // Some entries don't parse correctly into a number, force the range to be 0-10,
      // because that's the normal range anyways.
      // imdbFilterOptions.value = [result.minIMDBRating, result.maxIMDBRating]
      imdbFilterOptions.value = [0, 10]
      imdbFilter.value = imdbFilterOptions.value
    }
  }

  // Column filter functions written by AI
  // Custom filter functions for each column
  function yearColumnFilter(item: Movie): boolean {
    if (!enableYearFilter.value) return true // Skip filter if disabled

    const itemYear = parseInt(item.year?.toString() || '0', 10)
    return itemYear >= yearFilter.value[0] && itemYear <= yearFilter.value[1]
  }

  function runtimeColumnFilter(item: Movie): boolean {
    if (!enableRuntimeFilter.value) return true

    const itemRuntime = parseInt(item.runtime?.toString() || '0', 10)
    return itemRuntime >= runtimeFilter.value[0] && itemRuntime <= runtimeFilter.value[1]
  }

  function ratedColumnFilter(item: Movie, rateds: string[]): boolean {
    if (!enableRatedFilter.value) return true

    const itemRated = item.rated?.toString() || ''
    return rateds.includes(itemRated)
  }

  function genreColumnFilter(item: Movie, genres: string[]): boolean {
    if (!enableGenreFilter.value) return true

    const itemGenres = item.genres || []
    return genres.every((genre: string) => itemGenres.some((g) => g.includes(genre)))
  }

  function imdbColumnFilter(item: Movie): boolean {
    if (!enableIMDBFilter.value) return true

    const imdbRating = parseFloat(item['imdb.rating'].toString() || '0')
    return imdbRating >= imdbFilter.value[0] && imdbRating <= imdbFilter.value[1]
  }

  // Exclude items the user has already rated
  function personalRatingFilter(item: FullMovie): boolean {
    if (!enablePersonalRatingFilter.value) return true

    return item.rating === undefined
  }

  function customFilter(item: Movie): boolean {
    const namedGenres = genreFilterOptions.value.filter((val, index) =>
      genreFilter.value.includes(index),
    )
    const namedRateds = ratedFilterOptions.value.filter((val, index) =>
      ratedFilter.value.includes(index),
    )

    return (
      yearColumnFilter(item) &&
      runtimeColumnFilter(item) &&
      ratedColumnFilter(item, namedRateds) &&
      genreColumnFilter(item, namedGenres) &&
      imdbColumnFilter(item) &&
      personalRatingFilter(item)
    )
  }

  function searchFilter(value: string, query: string, item) {
    const tempValue = search.value
    if (!tempValue || tempValue.trim() === '') return customFilter(item.columns)

    return (
      value != null &&
      tempValue != null &&
      typeof value === 'string' &&
      value.indexOf(tempValue) !== -1 &&
      customFilter(item.columns)
    )
  }

  return {
    yearFilter,
    yearFilterOptions,
    runtimeFilter,
    runtimeFilterOptions,
    imdbFilter,
    imdbFilterOptions,
    ratedFilter,
    ratedFilterOptions,
    genreFilter,
    genreFilterOptions,
    filterChanged,
    searchFilter,
    search,
    enableGenreFilter,
    enableIMDBFilter,
    enableRatedFilter,
    enableRuntimeFilter,
    enableYearFilter,
    enablePersonalRatingFilter,
  }
}
