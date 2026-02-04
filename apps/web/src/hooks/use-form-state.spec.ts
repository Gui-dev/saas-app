import { act, renderHook } from '@testing-library/react'
import { requestFormReset } from 'react-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type IFormState, useFormState } from './use-form-state'

vi.mock('react-dom', () => ({
  requestFormReset: vi.fn(),
}))

describe('useFormState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Estado Inicial', () => {
    it('should return default initial state when no initial state is provided', () => {
      // Arrange
      const mockAction = vi
        .fn()
        .mockResolvedValue({ success: true, message: null, errors: null })

      // Act
      const { result } = renderHook(() => useFormState(mockAction))

      // Assert
      const [formState] = result.current
      expect(formState).toEqual({
        success: false,
        message: null,
        errors: null,
      })
    })

    it('should return custom initial state when provided', () => {
      // Arrange
      const mockAction = vi
        .fn()
        .mockResolvedValue({ success: true, message: null, errors: null })
      const customInitialState: IFormState = {
        success: true,
        message: 'Initial message',
        errors: { field: ['Initial error'] },
      }

      // Act
      const { result } = renderHook(() =>
        useFormState(mockAction, undefined, customInitialState)
      )

      // Assert
      const [formState] = result.current
      expect(formState).toEqual(customInitialState)
    })
  })

  describe('Form Submission', () => {
    it('should handle successful form submission', async () => {
      // Arrange
      const successState: IFormState = {
        success: true,
        message: 'Success message',
        errors: null,
      }
      const mockAction = vi.fn().mockResolvedValue(successState)
      const onSuccessSpy = vi.fn()

      const { result } = renderHook(() =>
        useFormState(mockAction, onSuccessSpy)
      )

      // Create mock form and event
      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      // Mock FormData constructor
      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockAction).toHaveBeenCalledTimes(1)
      expect(onSuccessSpy).toHaveBeenCalled()

      const [formState] = result.current
      expect(formState).toEqual(successState)
      expect(requestFormReset).toHaveBeenCalledWith(mockForm)

      // Cleanup
      formDataSpy.mockRestore()
    })

    it('should handle form submission with errors', async () => {
      // Arrange
      const errorState: IFormState = {
        success: false,
        message: 'Validation error',
        errors: { email: ['Invalid email'] },
      }
      const mockAction = vi.fn().mockResolvedValue(errorState)
      const onSuccessSpy = vi.fn()

      const { result } = renderHook(() =>
        useFormState(mockAction, onSuccessSpy)
      )

      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockAction).toHaveBeenCalled()
      expect(onSuccessSpy).not.toHaveBeenCalled()

      const [formState] = result.current
      expect(formState).toEqual(errorState)
      expect(requestFormReset).toHaveBeenCalledWith(mockForm)

      // Cleanup
      formDataSpy.mockRestore()
    })

    it('should not call onSuccess when action fails but still reset form', async () => {
      // Arrange
      const failState: IFormState = {
        success: false,
        message: 'Failed to submit',
        errors: null,
      }
      const mockAction = vi.fn().mockResolvedValue(failState)
      const onSuccessSpy = vi.fn()

      const { result } = renderHook(() =>
        useFormState(mockAction, onSuccessSpy)
      )

      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(onSuccessSpy).not.toHaveBeenCalled()
      expect(requestFormReset).toHaveBeenCalledWith(mockForm)

      // Cleanup
      formDataSpy.mockRestore()
    })
  })

  describe('Loading State (isPending)', () => {
    it('should set isPending to true during submission', async () => {
      // Arrange
      let resolveAction: (value: IFormState) => void
      const mockAction = vi.fn().mockImplementation(
        () =>
          new Promise(resolve => {
            resolveAction = resolve
          })
      )

      const { result } = renderHook(() => useFormState(mockAction))
      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act - Start submission
      const [, handleSubmit] = result.current
      act(() => {
        handleSubmit(mockEvent)
      })

      // Assert - Should be pending
      expect(result.current[2]).toBe(true)

      // Act - Resolve action
      await act(async () => {
        resolveAction?.({ success: true, message: null, errors: null })
      })

      // Assert - Should no longer be pending
      expect(result.current[2]).toBe(false)

      // Cleanup
      formDataSpy.mockRestore()
    })

    it('should reset isPending to false after successful submission', async () => {
      // Arrange
      const mockAction = vi
        .fn()
        .mockResolvedValue({ success: true, message: null, errors: null })
      const { result } = renderHook(() => useFormState(mockAction))
      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(result.current[2]).toBe(false)

      // Cleanup
      formDataSpy.mockRestore()
    })

    it('should reset isPending to false after failed submission', async () => {
      // Arrange
      const mockAction = vi
        .fn()
        .mockResolvedValue({ success: false, message: 'Error', errors: null })
      const { result } = renderHook(() => useFormState(mockAction))
      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(result.current[2]).toBe(false)

      // Cleanup
      formDataSpy.mockRestore()
    })
  })

  describe('Callback Integration', () => {
    it('should call onSuccess callback when action succeeds', async () => {
      // Arrange
      const successState: IFormState = {
        success: true,
        message: 'Success',
        errors: null,
      }
      const mockAction = vi.fn().mockResolvedValue(successState)
      const onSuccessSpy = vi.fn()

      const { result } = renderHook(() =>
        useFormState(mockAction, onSuccessSpy)
      )
      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(onSuccessSpy).toHaveBeenCalledTimes(1)
      expect(onSuccessSpy).toHaveBeenCalledWith()

      // Cleanup
      formDataSpy.mockRestore()
    })

    it('should handle async onSuccess callback properly', async () => {
      // Arrange
      const successState: IFormState = {
        success: true,
        message: 'Success',
        errors: null,
      }
      const mockAction = vi.fn().mockResolvedValue(successState)
      const onSuccessSpy = vi.fn().mockResolvedValue(undefined)

      const { result } = renderHook(() =>
        useFormState(mockAction, onSuccessSpy)
      )
      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(onSuccessSpy).toHaveBeenCalledTimes(1)

      // Cleanup
      formDataSpy.mockRestore()
    })

    it('should not call onSuccess callback when action fails', async () => {
      // Arrange
      const failState: IFormState = {
        success: false,
        message: 'Failed',
        errors: null,
      }
      const mockAction = vi.fn().mockResolvedValue(failState)
      const onSuccessSpy = vi.fn()

      const { result } = renderHook(() =>
        useFormState(mockAction, onSuccessSpy)
      )
      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(onSuccessSpy).not.toHaveBeenCalled()

      // Cleanup
      formDataSpy.mockRestore()
    })

    it('should work without onSuccess callback', async () => {
      // Arrange
      const successState: IFormState = {
        success: true,
        message: 'Success',
        errors: null,
      }
      const mockAction = vi.fn().mockResolvedValue(successState)

      const { result } = renderHook(() => useFormState(mockAction))
      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act & Assert - Should not throw error
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      const [formState] = result.current
      expect(formState).toEqual(successState)

      // Cleanup
      formDataSpy.mockRestore()
    })
  })

  describe('Form Data Extraction', () => {
    it('should extract form data correctly from form element', async () => {
      // Arrange
      const mockAction = vi
        .fn()
        .mockResolvedValue({ success: true, message: null, errors: null })
      const { result } = renderHook(() => useFormState(mockAction))

      const mockForm = document.createElement('form')
      const mockInput = document.createElement('input')
      mockInput.name = 'email'
      mockInput.value = 'test@example.com'
      mockForm.appendChild(mockInput)

      // Create a complete mock FormData with all required methods
      const mockFormData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi
        .spyOn(global, 'FormData')
        .mockReturnValue(mockFormData)

      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockAction).toHaveBeenCalledTimes(1)
      expect(formDataSpy).toHaveBeenCalled()

      // Cleanup
      formDataSpy.mockRestore()
    })

    it('should prevent default form behavior', async () => {
      // Arrange
      const mockAction = vi
        .fn()
        .mockResolvedValue({ success: true, message: null, errors: null })
      const { result } = renderHook(() => useFormState(mockAction))

      const mockForm = document.createElement('form')

      // Create a complete mock FormData with all required methods
      const mockData = {
        append: vi.fn(),
        delete: vi.fn(),
        get: vi.fn().mockReturnValue('test@example.com'),
        getAll: vi.fn().mockReturnValue(['test@example.com']),
        has: vi.fn().mockReturnValue(true),
        set: vi.fn(),
        forEach: vi.fn(),
        entries: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
        keys: vi.fn().mockReturnValue(['email'][Symbol.iterator]()),
        values: vi
          .fn()
          .mockReturnValue(['test@example.com'][Symbol.iterator]()),
        [Symbol.iterator]: vi
          .fn()
          .mockReturnValue([['email', 'test@example.com']][Symbol.iterator]()),
      } as unknown as FormData

      const formDataSpy = vi.spyOn(global, 'FormData').mockReturnValue(mockData)
      const mockEvent = {
        preventDefault: vi.fn(),
        currentTarget: mockForm,
      } as any

      // Act
      const [, handleSubmit] = result.current
      await act(async () => {
        await handleSubmit(mockEvent)
      })

      // Assert
      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1)

      // Cleanup
      formDataSpy.mockRestore()
    })
  })
})
