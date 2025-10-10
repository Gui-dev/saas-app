import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    environment: 'node',
    testTimeout: 10000,
    hookTimeout: 10000,
  },
})
