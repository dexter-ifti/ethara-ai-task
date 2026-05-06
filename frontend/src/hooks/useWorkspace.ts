import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Comment, Dashboard, Project, Task, User } from '../types'
import { createApi } from '../utils/api'

export function useWorkspace(
  accessToken: string,
  canManage: boolean,
  saveSession: (token: string, user: User) => void,
  clearSession: () => void,
) {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [activeProjectId, setActiveProjectId] = useState('')
  const [activeTaskId, setActiveTaskId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const api = useMemo(
    () => createApi(() => accessToken, saveSession, clearSession),
    [accessToken, saveSession, clearSession],
  )

  const activeTask = useMemo(() => tasks.find((task) => task._id === activeTaskId), [activeTaskId, tasks])
  const activeProject = useMemo(
    () => projects.find((project) => project._id === activeProjectId) ?? projects[0],
    [activeProjectId, projects],
  )

  const loadWorkspace = useCallback(async () => {
    setLoading(true)
    setMessage('')

    try {
      const [projectData, taskData, dashboardData, userData] = await Promise.all([
        api<{ projects: Project[] }>('/projects'),
        api<{ tasks: Task[] }>('/tasks'),
        api<{ dashboard: Dashboard }>('/dashboard'),
        canManage ? api<{ users: User[] }>('/users') : Promise.resolve({ users: [] }),
      ])

      setProjects(projectData.projects)
      setTasks(taskData.tasks)
      setDashboard(dashboardData.dashboard)
      setUsers(userData.users)
      setActiveProjectId((current) => current || projectData.projects[0]?._id || '')
      setActiveTaskId((current) => current || taskData.tasks[0]?._id || '')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load workspace')
    } finally {
      setLoading(false)
    }
  }, [api, canManage])

  useEffect(() => {
    if (!accessToken) return
    const timer = window.setTimeout(() => {
      void loadWorkspace()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [accessToken, loadWorkspace])

  useEffect(() => {
    if (!activeTaskId) return

    let ignore = false
    const timer = window.setTimeout(() => {
      void api<{ comments: Comment[] }>(`/comments/task/${activeTaskId}`).then((data) => {
        if (!ignore) setComments(data.comments)
      })
    }, 0)

    return () => {
      ignore = true
      window.clearTimeout(timer)
    }
  }, [activeTaskId, api])

  async function mutate(action: () => Promise<unknown>, reload = true) {
    setLoading(true)
    setMessage('')

    try {
      await action()
      if (reload) await loadWorkspace()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  const reset = useCallback(() => {
    setProjects([])
    setTasks([])
    setUsers([])
    setDashboard(null)
    setComments([])
  }, [])

  return {
    projects,
    tasks,
    users,
    comments,
    setComments,
    dashboard,
    activeProjectId,
    setActiveProjectId,
    activeTaskId,
    setActiveTaskId,
    activeTask,
    activeProject,
    message,
    setMessage,
    loading,
    setLoading,
    api,
    mutate,
    reset,
  }
}
