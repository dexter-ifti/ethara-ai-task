import type { FormEvent } from 'react'
import { Field } from '../components/Field'
import type { AuthMode } from '../types'

type AuthPageProps = {
  authMode: AuthMode
  setAuthMode: (mode: AuthMode) => void
  loading: boolean
  message: string
  onAuth: (event: FormEvent<HTMLFormElement>) => void
}

export function AuthPage({ authMode, setAuthMode, loading, message, onAuth }: AuthPageProps) {
  return (
    <main className="min-h-screen bg-soft px-4 py-8 text-ink">
      <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue">Team task manager</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Plan projects, assign tasks, and keep team delivery visible.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
            A clean assignment-ready workspace with authentication, roles, project teams, status tracking, and task
            comments wired to your Express API.
          </p>
        </div>

        <form onSubmit={onAuth} className="rounded-lg border border-line bg-paper p-6 shadow-sm">
          <div className="mb-6 flex rounded-md border border-line bg-soft p-1">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 rounded px-4 py-2 text-sm font-medium ${authMode === 'login' ? 'bg-ink text-white' : 'text-zinc-600'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 rounded px-4 py-2 text-sm font-medium ${authMode === 'signup' ? 'bg-ink text-white' : 'text-zinc-600'}`}
            >
              Signup
            </button>
          </div>

          {authMode === 'signup' && (
            <Field label="Name" name="name" placeholder="Your name" required />
          )}
          <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
          <Field label="Password" name="password" type="password" placeholder="At least 8 characters" required />
          {authMode === 'signup' && (
            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-medium">Role</span>
              <select name="role" className="h-11 w-full rounded-md border border-line bg-white px-3 outline-blue">
                <option value="team_member">Team member</option>
                <option value="project_manager">Project manager</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}

          {message && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}

          <button
            disabled={loading}
            className="h-11 w-full rounded-md bg-blue px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}
