import { type FormEvent, useState, useTransition } from 'react'
import { requestFormReset } from 'react-dom'

export interface IFormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export const useFormState = (
  action: (data: FormData) => Promise<IFormState>,
  onSuccess?: () => Promise<void> | void,
  initialState?: IFormState
) => {
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState(
    initialState ?? {
      success: false,
      message: null,
      errors: null,
    }
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const state = await action(data)

      if (state.success && onSuccess) {
        await onSuccess()
      }
      setFormState(state)
      requestFormReset(form)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
