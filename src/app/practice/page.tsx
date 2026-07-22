import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function PracticeHome() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name')

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-white">Practice</h1>
      <div className="mt-6 divide-y divide-gray-800 border-t border-gray-800">
        {categories?.map((c) => (
          <Link key={c.id} href={`/practice/${c.slug}`}
            className="block py-4 hover:text-red-500">
            <div className="font-medium text-white group-hover:text-red-500">{c.name}</div>
            {c.description && <div className="mt-1 text-sm text-gray-500">{c.description}</div>}
          </Link>
        ))}
        {categories?.length === 0 && (
          <p className="py-4 text-sm text-gray-500">No categories yet — add some in /admin.</p>
        )}
      </div>
    </div>
  )
}