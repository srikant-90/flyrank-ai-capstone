import { useState, useEffect } from 'react'

// Manual addition: the AI draft had no persistence at all — tasks vanished
// on refresh. This hook syncs state to localStorage so the app survives
// a page reload, without duplicating that logic in every component.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (err) {
      console.error(`Could not read localStorage key "${key}":`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(`Could not write localStorage key "${key}":`, err)
    }
  }, [key, value])

  return [value, setValue]
}
