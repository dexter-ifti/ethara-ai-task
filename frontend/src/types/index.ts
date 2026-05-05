export type Role = 'admin' | 'project_manager' | 'team_member'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export type User = {
  _id: string
  name: string
  email: string
  role: Role
}

export type Project = {
  _id: string
  name: string
  description?: string
  owner: User
  members: User[]
}

export type Task = {
  _id: string
  title: string
  description?: string
  project: Project | { _id: string; name: string }
  assignedTo?: User
  createdBy: User
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
}

export type Comment = {
  _id: string
  message: string
  author: User
  createdAt: string
}

export type Dashboard = {
  projects: number
  tasks: {
    total: number
    overdue: number
    assignedToMe: number
    byStatus: Partial<Record<TaskStatus, number>>
  }
}

export type AuthMode = 'login' | 'signup'
