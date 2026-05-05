import { useCallback, useState } from 'react'
import type { User } from '../types'

export function useAuth() {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') ?? '')
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as User) : null
  })

  const saveSession = useCallback((token: string, user: User) => {
    localStorage.setItem('accessToken', token)
    localStorage.setItem('user', JSON.stringify(user))
    setAccessToken(token)
    setCurrentUser(user)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setAccessToken('')
    setCurrentUser(null)
  }, [])

  return { accessToken, currentUser, saveSession, clearSession }
}
