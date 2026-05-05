import type { Task } from '../types'

export function getProjectId(task: Task) {
  return typeof task.project === 'string' ? task.project : task.project._id
}

export function getProjectName(task: Task) {
  return typeof task.project === 'string' ? task.project : task.project.name
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}
