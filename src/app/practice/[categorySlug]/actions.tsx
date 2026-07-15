'use server'

import { createClient } from '@/utils/supabase/server'

export async function submitAnswer(
  questionId: string,
  choiceId: string,
  isCorrect: boolean
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('user_progress').insert({
    user_id: user.id,
    question_id: questionId,
    is_correct: isCorrect,
  })

  if (error) return { error: error.message }
  return { success: true }
}