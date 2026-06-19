import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import MoviesTable from '../MoviesTable.vue'

describe('MoviesTable', () => {
  it('renders properly', () => {
    const wrapper = mount(MoviesTable)
    expect(wrapper.text()).toContain('Movies')
  })
})
