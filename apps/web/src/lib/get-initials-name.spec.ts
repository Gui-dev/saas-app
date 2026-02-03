import { describe, expect, it } from 'vitest'
import { getInitialsName } from './get-initials-name'

describe('getInitialsName', () => {
  it('should return the first letter of each word in uppercase', () => {
    expect(getInitialsName('Bruce Wayne')).toBe('BW')
    expect(getInitialsName('clark kent')).toBe('CK')
    expect(getInitialsName('Diana Prince')).toBe('DP')
  })

  it('should handle single word names', () => {
    expect(getInitialsName('Batman')).toBe('B')
    expect(getInitialsName('superman')).toBe('S')
  })

  it('should handle empty string', () => {
    expect(getInitialsName('')).toBe('')
  })

  it('should handle names with multiple spaces', () => {
    expect(getInitialsName('  Bruce   Wayne  ')).toBe('BW')
    expect(getInitialsName('Diana   Prince')).toBe('DP')
  })

  it('should handle names with special characters', () => {
    expect(getInitialsName('Arthur Curry')).toBe('AC')
    expect(getInitialsName('Barry Allen')).toBe('BA')
  })

  it('should handle names with numbers', () => {
    expect(getInitialsName('Bruce 123')).toBe('B1')
    expect(getInitialsName('123 Clark')).toBe('1C')
  })

  it('should handle names with non-alphabetic characters', () => {
    expect(getInitialsName('Bruce-Wayne')).toBe('BW')
    expect(getInitialsName('Clark_Kent')).toBe('CK')
  })
})
