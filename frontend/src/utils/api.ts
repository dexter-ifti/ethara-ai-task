import type { User } from '../types'
import { apiUrl } from './constants'

type SessionSaver = (token: string, user: User) => void
type SessionClearer = () => void

export function createApi(
  getAccessToken: () => string,
  saveSession: SessionSaver,
  clearSession: SessionClearer,
) {
  return async function api<T>(path: string, options: RequestInit = {}, allowRefresh = true): Promise<T> {
    const accessToken = getAccessToken()

    const request = (token: string) =>
      fetch(`${apiUrl}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      })

    let response = await request(accessToken)

    if (response.status === 401 && allowRefresh && accessToken) {
      const refreshed = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (refreshed.ok) {
        const data = (await refreshed.json()) as { accessToken: string; user: User }
        saveSession(data.accessToken, data.user)
        response = await request(data.accessToken)
      }

      if (!refreshed.ok) {
        clearSession()
      }
    }

    if (!response.ok) {
      const error = (await response.json().catch(() => ({ message: 'Request failed' }))) as { message?: string }
      throw new Error(error.message ?? 'Request failed')
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  }
}
