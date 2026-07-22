import { createClient } from '@/utils/supabase/server'

export async function getCurrentRank(totalXp: number) {
  const supabase = await createClient()
  const { data: ranks } = await supabase
    .from('ranks')
    .select('id, name, min_score')
    .lte('min_score', totalXp)
    .order('min_score', { ascending: false })
    .limit(1)
    .single()

  const { data: nextRank } = await supabase
    .from('ranks')
    .select('id, name, min_score')
    .gt('min_score', totalXp)
    .order('min_score', { ascending: true })
    .limit(1)
    .single()

  return { current: ranks, next: nextRank }
}