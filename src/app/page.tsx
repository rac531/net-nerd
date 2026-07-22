import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

const interfaces = [
  { name: 'Practice', desc: 'Randomized questions by category, instant feedback' },
  { name: 'Progress', desc: 'XP, ranks, and accuracy tracked by topic' },
  { name: 'Review', desc: 'Every question you\u2019ve missed, one place to fix it' },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Study CCNA like you&rsquo;re actually
          <span className="text-red-600"> configuring the network</span>.
        </h1>

        <p className="mt-6 text-base text-gray-400">
          Subnetting, routing, and VLAN questions with instant feedback and
          explanations. Track your progress until you&rsquo;re exam-ready.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded border border-gray-800 px-6 py-3 text-sm font-medium text-white hover:border-red-600 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="rounded border border-gray-800 px-6 py-3 text-sm font-medium text-white hover:border-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Log in
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature list — plain, no card fills */}
      <section className="mx-auto max-w-xl border-t border-gray-800 px-6 py-16">
        <div className="divide-y divide-gray-800">
          {interfaces.map((row) => (
            <div key={row.name} className="flex items-baseline justify-between py-5">
              <span className="text-sm font-medium text-white">{row.name}</span>
              <span className="ml-6 text-right text-sm text-gray-400">{row.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8 text-center">
        <p className="text-xs text-gray-500">netnerd &mdash; built while studying for the CCNA.</p>
      </footer>
    </div>
  )
}