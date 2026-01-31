import '@testing-library/jest-dom'
import { vi } from 'vitest'

global.FormData = vi.fn(() => ({})) as any
