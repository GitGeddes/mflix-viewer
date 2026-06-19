// Setup script to get Vuetify and CSS parsing working in Vitest
import { config } from '@vue/test-utils'
import { vuetify } from '@/main.ts'
import resizeObserver from 'resize-observer-polyfill'

config.global.plugins = [vuetify]
global.ResizeObserver = resizeObserver
