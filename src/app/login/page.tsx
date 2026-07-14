import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <form className="w-full max-w-sm space-y-4 rounded-lg bg-gray-900 p-8">
        <h1 className="text-xl font-bold text-white">netnerd</h1>

        {params.error && (
          <p className="rounded bg-red-950 p-2 text-sm text-red-400">{params.error}</p>
        )}
        {params.message && (
          <p className="rounded bg-green-950 p-2 text-sm text-green-400">{params.message}</p>
        )}

        <div>
          <label htmlFor="email" className="text-sm text-gray-300">Email</label>
          <input id="email" name="email" type="email" required
            className="mt-1 w-full rounded bg-gray-800 p-2 text-white" />
        </div>

        <div>
          <label htmlFor="password" className="text-sm text-gray-300">Password</label>
          <input id="password" name="password" type="password" required
            className="mt-1 w-full rounded bg-gray-800 p-2 text-white" />
        </div>

        <div className="flex gap-2">
          <button formAction={login}
            className="flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-500">
            Log in
          </button>
          <button formAction={signup}
            className="flex-1 rounded bg-gray-700 py-2 text-white hover:bg-gray-600">
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}