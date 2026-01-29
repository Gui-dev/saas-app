import { describe, expect, it } from 'vitest'
import { queryClient } from './react-query'

describe('react-query', () => {
  it('should create a QueryClient instance', () => {
    expect(queryClient).toBeDefined()
    expect(queryClient).toBeInstanceOf(Object)
  })

  it('should have default QueryClient configuration', () => {
    expect(queryClient.getDefaultOptions).toBeDefined()
    expect(queryClient.getDefaultOptions()).toBeDefined()
  })
})
