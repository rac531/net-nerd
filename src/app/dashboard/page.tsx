import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { logout } from '../login/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, rank_id')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-400">Signed in as {user.email}</p>
      <p className="mt-1 text-gray-400">
        Profile row: {profile ? 'found ✅' : 'missing ❌'}
      </p>
      <form action={logout}>
        <button className="mt-4 rounded bg-red-600 px-4 py-2 hover:bg-red-500">
          Log out
        </button>
      </form>
    </div>
  )
}