'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitAnswer } from '@/app/practice/[categorySlug]/actions'

type Choice = { id: string; choice_text: string; is_correct: boolean }
type Question = { id: string; question_text: string; explanation: string | null; answer_choices: Choice[] }

export default function QuestionCard({
  question,
  categorySlug,
}: {
  question: Question
  categorySlug: string
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const selectedChoice = question.answer_choices.find((c) => c.id === selected)
  const isCorrect = selectedChoice?.is_correct ?? false

  async function handleSubmit() {
    if (!selected) return
    setSubmitted(true)
    await submitAnswer(question.id, selected, isCorrect)
  }

  function handleNext() {
    router.refresh() // re-fetches a new random question via the server component
  }

  return (
    <div className="mt-6 rounded-lg bg-gray-900 p-6">
      <p className="text-lg">{question.question_text}</p>

      <div className="mt-4 space-y-2">
        {question.answer_choices.map((choice) => {
          const isSelected = selected === choice.id
          const showResult = submitted
          let style = 'border-gray-700 hover:border-gray-500'

          if (showResult && choice.is_correct) style = 'border-green-500 bg-green-950'
          else if (showResult && isSelected && !choice.is_correct) style = 'border-red-500 bg-red-950'
          else if (isSelected) style = 'border-blue-500'

          return (
            <button
              key={choice.id}
              disabled={submitted}
              onClick={() => setSelected(choice.id)}
              className={`w-full rounded border p-3 text-left ${style}`}
            >
              {choice.choice_text}
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="mt-4 rounded bg-blue-600 px-4 py-2 hover:bg-blue-500 disabled:opacity-40"
        >
          Submit
        </button>
      ) : (
        <div className="mt-4">
          <p className={isCorrect ? 'text-green-400' : 'text-red-400'}>
            {isCorrect ? 'Correct!' : 'Incorrect.'}
          </p>
          {question.explanation && (
            <p className="mt-2 text-sm text-gray-400">{question.explanation}</p>
          )}
          <button
            onClick={handleNext}
            className="mt-4 rounded bg-gray-700 px-4 py-2 hover:bg-gray-600"
          >
            Next question
          </button>
        </div>
      )}
    </div>
  )
}