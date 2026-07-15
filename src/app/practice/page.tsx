import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function PracticeHome() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name')

  return (
    <div className="mx-auto max-w-2xl p-8 text-white">
      <h1 className="text-2xl font-bold">Practice</h1>
      <div className="mt-6 grid gap-3">
        {categories?.map((c) => (
          <Link key={c.id} href={`/practice/${c.slug}`}
            className="rounded-lg bg-gray-900 p-4 hover:bg-gray-800">
            <div className="font-semibold">{c.name}</div>
            {c.description && <div className="text-sm text-gray-400">{c.description}</div>}
          </Link>
        ))}
        {categories?.length === 0 && (
          <p className="text-gray-400">No categories yet — add some in /admin.</p>
        )}
      </div>
    </div>
  )
}