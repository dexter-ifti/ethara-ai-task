import type { TaskStatus } from '../types'

export const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

export const statusLabels: Record<TaskStatus, string> = {
  todo: 'Todo',
  in_progress: 'In progress',
  review: 'Review',
  done: 'Done',
}
