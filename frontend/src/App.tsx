import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from './hooks/useAuth'
import { useWorkspace } from './hooks/useWorkspace'
import { AuthPage } from './pages/AuthPage'
import { WorkspacePage } from './pages/WorkspacePage'
import type { AuthMode, Comment, TaskStatus, User } from './types'

function App() {
  const { accessToken, currentUser, saveSession, clearSession } = useAuth()
  const [authMode, setAuthMode] = useState<AuthMode>('login')

  const workspace = useWorkspace(accessToken, saveSession, clearSession)
  const {
    projects,
    tasks,
    comments,
    dashboard,
    activeProject,
    activeTask,
    activeTaskId,
    message,
    setMessage,
    loading,
    setLoading,
    api,
    mutate,
    setComments,
    setActiveProjectId,
    setActiveTaskId,
    reset,
  } = workspace

  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'project_manager'

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const payload =
      authMode === 'signup'
        ? {
            name: String(form.get('name')),
            email: String(form.get('email')),
            password: String(form.get('password')),
            role: String(form.get('role')),
          }
        : {
            email: String(form.get('email')),
            password: String(form.get('password')),
          }

    setLoading(true)
    setMessage('')

    try {
      const data = await api<{ accessToken: string; user: User }>(`/auth/${authMode}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      saveSession(data.accessToken, data.user)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await api('/auth/logout', { method: 'POST' }).catch(() => undefined)
    clearSession()
    reset()
  }

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const members = String(form.get('members') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    await mutate(() =>
      api('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: String(form.get('name')),
          description: String(form.get('description')),
          members,
        }),
      }),
    )
    event.currentTarget.reset()
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const assignedTo = String(form.get('assignedTo') ?? '').trim()
    const dueDate = String(form.get('dueDate') ?? '').trim()

    await mutate(() =>
      api('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: String(form.get('title')),
          description: String(form.get('description')),
          project: String(form.get('project')),
          assignedTo: assignedTo || undefined,
          priority: String(form.get('priority')),
          dueDate: dueDate || undefined,
        }),
      }),
    )
    event.currentTarget.reset()
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    await mutate(() =>
      api(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    )
  }

  async function handleAddComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeTaskId) return
    const form = new FormData(event.currentTarget)

    await mutate(
      () =>
        api('/comments', {
          method: 'POST',
          body: JSON.stringify({
            task: activeTaskId,
            message: String(form.get('message')),
          }),
        }),
      false,
    )

    const data = await api<{ comments: Comment[] }>(`/comments/task/${activeTaskId}`)
    setComments(data.comments)
    event.currentTarget.reset()
  }

  if (!currentUser) {
    return (
      <AuthPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        loading={loading}
        message={message}
        onAuth={handleAuth}
      />
    )
  }

  return (
    <WorkspacePage
      currentUser={currentUser}
      projects={projects}
      tasks={tasks}
      comments={comments}
      dashboard={dashboard}
      activeProject={activeProject}
      activeTask={activeTask}
      activeTaskId={activeTaskId}
      canManage={canManage}
      loading={loading}
      message={message}
      onLogout={handleLogout}
      onSetActiveProjectId={setActiveProjectId}
      onSetActiveTaskId={setActiveTaskId}
      onCreateProject={handleCreateProject}
      onCreateTask={handleCreateTask}
      onStatusChange={handleStatusChange}
      onAddComment={handleAddComment}
    />
  )
}

export default App
