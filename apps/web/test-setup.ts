import '@testing-library/jest-dom'

// Mock FormData with proper get method
class MockFormData {
  private data = new Map<string, FormDataEntryValue>()

  append(name: string, value: string | Blob): void {
    this.data.set(name, value as FormDataEntryValue)
  }

  get(name: string): FormDataEntryValue | null {
    return this.data.get(name) ?? null
  }

  getAll(name: string): FormDataEntryValue[] {
    const value = this.data.get(name)
    return value ? [value] : []
  }

  has(name: string): boolean {
    return this.data.has(name)
  }

  delete(name: string): void {
    this.data.delete(name)
  }

  set(name: string, value: string | Blob): void {
    this.data.set(name, value as FormDataEntryValue)
  }

  forEach(
    callback: (value: FormDataEntryValue, key: string, parent: FormData) => void
  ): void {
    this.data.forEach((value, key) => {
      callback(value, key, this as unknown as FormData)
    })
  }

  entries(): IterableIterator<[string, FormDataEntryValue]> {
    return this.data.entries()
  }

  keys(): IterableIterator<string> {
    return this.data.keys()
  }

  values(): IterableIterator<FormDataEntryValue> {
    return this.data.values()
  }

  [Symbol.iterator](): IterableIterator<[string, FormDataEntryValue]> {
    return this.data.entries()
  }
}

global.FormData = MockFormData as any
