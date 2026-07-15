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
    <div className="mx-auto max-w-2xl p-8 text-white">
      <h1 className="text-2xl font-bold">Admin</h1>

      {params.error && (
        <p className="mt-4 rounded bg-red-950 p-2 text-sm text-red-400">{params.error}</p>
      )}
      {params.message && (
        <p className="mt-4 rounded bg-green-950 p-2 text-sm text-green-400">{params.message}</p>
      )}

      {/* Add category */}
      <section className="mt-8 rounded-lg bg-gray-900 p-6">
        <h2 className="text-lg font-semibold">New Category</h2>
        <form action={addCategory} className="mt-4 space-y-3">
          <input name="name" placeholder="Name (e.g. Subnetting)" required
            className="w-full rounded bg-gray-800 p-2" />
          <input name="slug" placeholder="Slug (e.g. subnetting)" required
            className="w-full rounded bg-gray-800 p-2" />
          <textarea name="description" placeholder="Description"
            className="w-full rounded bg-gray-800 p-2" />
          <button className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500">
            Add Category
          </button>
        </form>
      </section>

      {/* Add question */}
      <section className="mt-8 rounded-lg bg-gray-900 p-6">
        <h2 className="text-lg font-semibold">New Question</h2>
        <form action={addQuestion} className="mt-4 space-y-3">
          <select name="category_id" required className="w-full rounded bg-gray-800 p-2">
            <option value="">Select category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <textarea name="question_text" placeholder="Question text" required
            className="w-full rounded bg-gray-800 p-2" />

          <select name="difficulty" className="w-full rounded bg-gray-800 p-2">
            <option value="easy">Easy</option>
            <option value="medium" selected>Medium</option>
            <option value="hard">Hard</option>
          </select>

          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" name="correct_choice" value={i} required />
                <input name={`choice_${i}`} placeholder={`Choice ${i + 1}`} required
                  className="flex-1 rounded bg-gray-800 p-2" />
              </div>
            ))}
          </div>

          <textarea name="explanation" placeholder="Explanation (shown after answering)"
            className="w-full rounded bg-gray-800 p-2" />

          <button className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500">
            Add Question
          </button>
        </form>
      </section>
    </div>
  )
}