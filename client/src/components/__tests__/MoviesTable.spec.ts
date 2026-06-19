import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import MoviesTable from '../MoviesTable.vue'
import { vuetify } from '@/main.ts'

import resizeObserver from 'resize-observer-polyfill'
global.ResizeObserver = resizeObserver

describe('MoviesTable', () => {
  it('renders properly', () => {
    const wrapper = mount(MoviesTable, {
      global: {
        plugins: [vuetify],
      },
    })
    expect(wrapper.text()).toContain('Movies')
  })
})
