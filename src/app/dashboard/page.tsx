import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { logout } from '../login/actions'
import { getCurrentRank } from '@/utils/ranks'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, total_xp')
    .eq('id', user.id)
    .single()

  const totalXp = profile?.total_xp ?? 0
  const { current, next } = await getCurrentRank(totalXp)

  const { data: progress } = await supabase
    .from('user_progress')
    .select('is_correct, answered_at, question_id, questions(category_id, categories(name))')
    .eq('user_id', user.id)
    .order('answered_at', { ascending: false })

  const totalAnswered = progress?.length ?? 0
  const totalCorrect = progress?.filter((p) => p.is_correct).length ?? 0
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  let streak = 0
  for (const p of progress ?? []) {
    if (p.is_correct) streak++
    else break
  }

  const byCategory: Record<string, { correct: number; total: number }> = {}
  for (const p of progress ?? []) {
    const catName = (p.questions as any)?.categories?.name ?? 'Unknown'
    if (!byCategory[catName]) byCategory[catName] = { correct: 0, total: 0 }
    byCategory[catName].total++
    if (p.is_correct) byCategory[catName].correct++
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">{user.email}</p>

      {/* Rank */}
      <section className="mt-8 border-t border-gray-800 py-6">
        <p className="text-sm text-gray-500">Current rank</p>
        <p className="mt-1 text-xl font-semibold text-white">{current?.name ?? 'Novice'}</p>
        <p className="mt-1 text-sm text-gray-400">{totalXp} XP</p>
        {next && (
          <p className="mt-2 text-xs text-gray-500">
            {next.min_score - totalXp} XP to reach {next.name}
          </p>
        )}
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 divide-y divide-gray-800 border-t border-gray-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="py-6 text-center sm:py-6">
          <p className="text-2xl font-semibold text-white">{totalAnswered}</p>
          <p className="text-xs text-gray-500">Answered</p>
        </div>
        <div className="py-6 text-center">
          <p className="text-2xl font-semibold text-white">{accuracy}%</p>
          <p className="text-xs text-gray-500">Accuracy</p>
        </div>
        <div className="py-6 text-center">
          <p className="text-2xl font-semibold text-white">{streak}</p>
          <p className="text-xs text-gray-500">Current streak</p>
        </div>
      </section>

      {/* By category */}
      <section className="border-t border-gray-800 py-6">
        <h2 className="text-sm font-medium text-white">By category</h2>
        <div className="mt-4 divide-y divide-gray-800">
          {Object.entries(byCategory).length === 0 && (
            <p className="py-3 text-sm text-gray-500">No attempts yet — go practice.</p>
          )}
          {Object.entries(byCategory).map(([name, stats]) => (
            <div key={name} className="flex justify-between py-3 text-sm">
              <span className="text-gray-300">{name}</span>
              <span className="text-gray-500">
                {stats.correct}/{stats.total} ({Math.round((stats.correct / stats.total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </section>

      <form action={logout} className="border-t border-gray-800 pt-6">
        <button className="rounded border border-gray-800 px-4 py-2 text-sm text-white hover:border-red-600 hover:text-red-500">
          Log out
        </button>
      </form>
    </div>
  )
}