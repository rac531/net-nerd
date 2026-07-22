import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import QuestionCard from '@/components/QuestionCard'

export default async function PracticePage({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const { categorySlug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: category } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', categorySlug)
    .single()

  if (!category) notFound()

  const { data: questions } = await supabase
    .from('questions')
    .select('id, question_text, explanation, answer_choices(id, choice_text, is_correct)')
    .eq('category_id', category.id)

  if (!questions || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-xl font-semibold text-white">{category.name}</h1>
        <p className="mt-4 text-sm text-gray-500">No questions in this category yet.</p>
      </div>
    )
  }

  const question = questions[Math.floor(Math.random() * questions.length)]

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-xl font-semibold text-white">{category.name}</h1>
      <QuestionCard
        key={question.id}
        question={question}
        categorySlug={categorySlug}
      />
    </div>
  )
}