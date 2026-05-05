import type { FormEvent } from 'react'
import { Empty } from '../components/Empty'
import { Field } from '../components/Field'
import { Metric } from '../components/Metric'
import { Panel } from '../components/Panel'
import type { Comment, Dashboard, Project, Task, TaskStatus, User } from '../types'
import { statusLabels } from '../utils/constants'
import { formatDate, getProjectId, getProjectName } from '../utils/helpers'

type WorkspacePageProps = {
  currentUser: User
  projects: Project[]
  tasks: Task[]
  comments: Comment[]
  dashboard: Dashboard | null
  activeProject: Project | undefined
  activeTask: Task | undefined
  activeTaskId: string
  canManage: boolean
  loading: boolean
  message: string
  onLogout: () => void
  onSetActiveProjectId: (id: string) => void
  onSetActiveTaskId: (id: string) => void
  onCreateProject: (event: FormEvent<HTMLFormElement>) => void
  onCreateTask: (event: FormEvent<HTMLFormElement>) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onAddComment: (event: FormEvent<HTMLFormElement>) => void
}

export function WorkspacePage({
  currentUser,
  projects,
  tasks,
  comments,
  dashboard,
  activeProject,
  activeTask,
  activeTaskId,
  canManage,
  loading,
  message,
  onLogout,
  onSetActiveProjectId,
  onSetActiveTaskId,
  onCreateProject,
  onCreateTask,
  onStatusChange,
  onAddComment,
}: WorkspacePageProps) {
  return (
    <main className="min-h-screen bg-soft text-ink">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue">Team task manager</p>
            <h1 className="text-2xl font-semibold">Workspace</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-line bg-soft px-3 py-2 text-sm">
              {currentUser.name} · {currentUser.role.replace('_', ' ')}
            </span>
            <button onClick={onLogout} className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 xl:grid-cols-[280px_1fr_360px]">
        <aside className="space-y-5">
          <Panel title="Dashboard">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Projects" value={dashboard?.projects ?? 0} />
              <Metric label="Tasks" value={dashboard?.tasks.total ?? 0} />
              <Metric label="Overdue" value={dashboard?.tasks.overdue ?? 0} />
              <Metric label="Mine open" value={dashboard?.tasks.assignedToMe ?? 0} />
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(statusLabels).map(([status, label]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600">{label}</span>
                  <strong>{dashboard?.tasks.byStatus[status as TaskStatus] ?? 0}</strong>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Projects">
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => onSetActiveProjectId(project._id)}
                  className={`w-full rounded-md border px-3 py-3 text-left text-sm ${
                    activeProject?._id === project._id ? 'border-blue bg-blue text-white' : 'border-line bg-white hover:border-zinc-400'
                  }`}
                >
                  <span className="block font-semibold">{project.name}</span>
                  <span className={activeProject?._id === project._id ? 'text-blue-100' : 'text-zinc-500'}>
                    {project.members.length} members
                  </span>
                </button>
              ))}
              {!projects.length && <Empty text="No projects yet." />}
            </div>
          </Panel>
        </aside>

        <section className="space-y-5">
          {message && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}

          {canManage && (
            <Panel title="Create task">
              <form onSubmit={onCreateTask} className="grid gap-3 md:grid-cols-2">
                <Field label="Title" name="title" placeholder="Design dashboard cards" required />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Project</span>
                  <select name="project" required className="h-11 w-full rounded-md border border-line bg-white px-3 outline-blue">
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Field label="Assign to user id" name="assignedTo" placeholder="Mongo user id" />
                <Field label="Due date" name="dueDate" type="date" />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Priority</span>
                  <select name="priority" className="h-11 w-full rounded-md border border-line bg-white px-3 outline-blue">
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium">Description</span>
                  <textarea name="description" rows={3} className="w-full rounded-md border border-line bg-white px-3 py-2 outline-blue" />
                </label>
                <button disabled={loading || !projects.length} className="h-11 rounded-md bg-blue px-4 text-sm font-semibold text-white disabled:opacity-60">
                  Create task
                </button>
              </form>
            </Panel>
          )}

          <Panel title={activeProject ? activeProject.name : 'Tasks'}>
            <div className="grid gap-3 lg:grid-cols-2">
              {tasks
                .filter((task) => !activeProject || getProjectId(task) === activeProject._id)
                .map((task) => (
                  <article
                    key={task._id}
                    onClick={() => onSetActiveTaskId(task._id)}
                    className={`rounded-lg border bg-white p-4 ${
                      activeTaskId === task._id ? 'border-blue ring-2 ring-blue/10' : 'border-line'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="mt-1 text-sm text-zinc-500">{getProjectName(task)}</p>
                      </div>
                      <span className="rounded bg-soft px-2 py-1 text-xs font-semibold uppercase text-zinc-600">
                        {task.priority}
                      </span>
                    </div>
                    <p className="min-h-10 text-sm leading-6 text-zinc-600">{task.description || 'No description added.'}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <select
                        value={task.status}
                        onChange={(event) => void onStatusChange(task._id, event.target.value as TaskStatus)}
                        className="h-9 rounded-md border border-line bg-white px-2 text-sm outline-blue"
                      >
                        {Object.entries(statusLabels).map(([status, label]) => (
                          <option key={status} value={status}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <span className="text-sm text-zinc-500">{task.assignedTo?.name ?? 'Unassigned'}</span>
                      {task.dueDate && <span className="text-sm text-zinc-500">Due {formatDate(task.dueDate)}</span>}
                    </div>
                  </article>
                ))}
              {!tasks.filter((task) => !activeProject || getProjectId(task) === activeProject._id).length && (
                <Empty text="No tasks for this project yet." />
              )}
            </div>
          </Panel>
        </section>

        <aside className="space-y-5">
          {canManage && (
            <Panel title="Create project">
              <form onSubmit={onCreateProject} className="space-y-3">
                <Field label="Project name" name="name" placeholder="Mobile app launch" required />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Description</span>
                  <textarea name="description" rows={3} className="w-full rounded-md border border-line bg-white px-3 py-2 outline-blue" />
                </label>
                <Field label="Member user ids" name="members" placeholder="Comma separated ids" />
                <button disabled={loading} className="h-11 w-full rounded-md bg-blue px-4 text-sm font-semibold text-white disabled:opacity-60">
                  Create project
                </button>
              </form>
            </Panel>
          )}

          <Panel title="Comments">
            {activeTask ? (
              <>
                <div className="mb-4 rounded-md bg-soft p-3">
                  <p className="text-sm font-semibold">{activeTask.title}</p>
                  <p className="text-sm text-zinc-500">{statusLabels[activeTask.status]}</p>
                </div>
                <form onSubmit={onAddComment} className="mb-4 space-y-3">
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Write a comment"
                    required
                    className="w-full rounded-md border border-line bg-white px-3 py-2 outline-blue"
                  />
                  <button disabled={loading} className="h-10 w-full rounded-md bg-ink px-4 text-sm font-semibold text-white disabled:opacity-60">
                    Add comment
                  </button>
                </form>
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <article key={comment._id} className="rounded-md border border-line bg-white p-3">
                      <div className="mb-1 flex items-center justify-between gap-2 text-xs text-zinc-500">
                        <span>{comment.author.name}</span>
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm leading-6">{comment.message}</p>
                    </article>
                  ))}
                  {!comments.length && <Empty text="No comments yet." />}
                </div>
              </>
            ) : (
              <Empty text="Select a task to view comments." />
            )}
          </Panel>
        </aside>
      </div>
    </main>
  )
}
