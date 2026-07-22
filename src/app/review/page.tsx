import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ReviewQuestionCard from '@/components/ReviewQuestionCard'

export default async function ReviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: missed } = await supabase
    .from('user_progress')
    .select('question_id')
    .eq('user_id', user.id)
    .eq('is_correct', false)

  const missedIds = [...new Set((missed ?? []).map((m) => m.question_id))]

  if (missedIds.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-white">Review</h1>
        <p className="mt-4 text-sm text-gray-500">
          No missed questions yet — go answer some in Practice.
        </p>
      </div>
    )
  }

  const { data: questions } = await supabase
    .from('questions')
    .select('id, question_text, explanation, categories(name), answer_choices(id, choice_text, is_correct)')
    .in('id', missedIds)

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-white">Review missed questions</h1>
      <p className="mt-1 text-sm text-gray-500">{questions?.length ?? 0} question(s)</p>

      <div className="mt-8 divide-y divide-gray-800 border-t border-gray-800">
        {questions?.map((q) => (
          <ReviewQuestionCard key={q.id} question={q} />
        ))}
      </div>
    </div>
  )
}