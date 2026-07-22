'use server'

import { createClient } from '@/utils/supabase/server'

export async function submitReviewAnswer(
  questionId: string,
  choiceId: string,
  isCorrect: boolean
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // log the retry attempt same as normal practice
  const { error: progressError } = await supabase.from('user_progress').insert({
    user_id: user.id,
    question_id: questionId,
    is_correct: isCorrect,
  })

  if (progressError) return { error: progressError.message }

  if (isCorrect) {
    await supabase.rpc('increment_xp', { user_id_input: user.id, amount: 10 })
  }

  return { success: true }
}