'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function addCategory(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('categories')
    .insert({ name, slug, description })

  if (error) {
    redirect('/admin?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/admin')
  redirect('/admin?message=Category added')
}

export async function addQuestion(formData: FormData) {
  const supabase = await createClient()

  const category_id = Number(formData.get('category_id'))
  const question_text = formData.get('question_text') as string
  const explanation = formData.get('explanation') as string
  const difficulty = formData.get('difficulty') as string

  const { data: question, error: qError } = await supabase
    .from('questions')
    .insert({ category_id, question_text, explanation, difficulty })
    .select()
    .single()

  if (qError || !question) {
    redirect('/admin?error=' + encodeURIComponent(qError?.message ?? 'Failed to create question'))
  }

  const correctIndex = formData.get('correct_choice') as string
  const choices = [0, 1, 2, 3].map((i) => ({
    question_id: question.id,
    choice_text: formData.get(`choice_${i}`) as string,
    is_correct: String(i) === correctIndex,
  }))

  const { error: cError } = await supabase.from('answer_choices').insert(choices)

  if (cError) {
    redirect('/admin?error=' + encodeURIComponent(cError.message))
  }

  revalidatePath('/admin')
  redirect('/admin?message=Question added')
}