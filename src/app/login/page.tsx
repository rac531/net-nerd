import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <form className="w-full max-w-sm space-y-5">
        <h1 className="text-xl font-semibold text-white">netnerd</h1>

        {params.error && (
          <p className="border border-gray-800 p-3 text-sm text-red-500">{params.error}</p>
        )}
        {params.message && (
          <p className="border border-gray-800 p-3 text-sm text-gray-400">{params.message}</p>
        )}

        <div>
          <label htmlFor="email" className="text-sm text-gray-400">Email</label>
          <input id="email" name="email" type="email" required
            className="mt-1 w-full border border-gray-800 bg-transparent p-2 text-white focus:border-red-600 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="password" className="text-sm text-gray-400">Password</label>
          <input id="password" name="password" type="password" required
            className="mt-1 w-full border border-gray-800 bg-transparent p-2 text-white focus:border-red-600 focus:outline-none" />
        </div>

        <div className="flex gap-3">
          <button formAction={login}
            className="flex-1 rounded bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-500">
            Log in
          </button>
          <button formAction={signup}
            className="flex-1 rounded border border-gray-800 py-2 text-sm font-medium text-white hover:border-gray-600">
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}