import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { addCategory, addQuestion } from './actions'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-white">Admin</h1>

      {params.error && (
        <p className="mt-4 border border-gray-800 p-3 text-sm text-red-500">{params.error}</p>
      )}
      {params.message && (
        <p className="mt-4 border border-gray-800 p-3 text-sm text-gray-400">{params.message}</p>
      )}

      {/* Add category */}
      <section className="mt-8 border-t border-gray-800 py-6">
        <h2 className="text-sm font-medium text-white">New category</h2>
        <form action={addCategory} className="mt-4 space-y-3">
          <input name="name" placeholder="Name (e.g. Subnetting)" required
            className="w-full border border-gray-800 bg-transparent p-2 text-white placeholder:text-gray-600 focus:border-red-600 focus:outline-none" />
          <input name="slug" placeholder="Slug (e.g. subnetting)" required
            className="w-full border border-gray-800 bg-transparent p-2 text-white placeholder:text-gray-600 focus:border-red-600 focus:outline-none" />
          <textarea name="description" placeholder="Description"
            className="w-full border border-gray-800 bg-transparent p-2 text-white placeholder:text-gray-600 focus:border-red-600 focus:outline-none" />
          <button className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500">
            Add category
          </button>
        </form>
      </section>

      {/* Add question */}
      <section className="border-t border-gray-800 py-6">
        <h2 className="text-sm font-medium text-white">New question</h2>
        <form action={addQuestion} className="mt-4 space-y-3">
          <select name="category_id" required
            className="w-full border border-gray-800 bg-black p-2 text-white focus:border-red-600 focus:outline-none">
            <option value="">Select category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <textarea name="question_text" placeholder="Question text" required
            className="w-full border border-gray-800 bg-transparent p-2 text-white placeholder:text-gray-600 focus:border-red-600 focus:outline-none" />

          <select name="difficulty" defaultValue="medium"
            className="w-full border border-gray-800 bg-black p-2 text-white focus:border-red-600 focus:outline-none">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" name="correct_choice" value={i} required
                  className="accent-red-600" />
                <input name={`choice_${i}`} placeholder={`Choice ${i + 1}`} required
                  className="flex-1 border border-gray-800 bg-transparent p-2 text-white placeholder:text-gray-600 focus:border-red-600 focus:outline-none" />
              </div>
            ))}
          </div>

          <textarea name="explanation" placeholder="Explanation (shown after answering)"
            className="w-full border border-gray-800 bg-transparent p-2 text-white placeholder:text-gray-600 focus:border-red-600 focus:outline-none" />

          <button className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500">
            Add question
          </button>
        </form>
      </section>
    </div>
  )
}