'use client'

import { useState } from 'react'
import { submitReviewAnswer } from '@/app/review/actions'

type Choice = { id: string; choice_text: string; is_correct: boolean }
type Question = {
  id: string
  question_text: string
  explanation: string | null
  categories: { name: string }[] | null
  answer_choices: Choice[]
}

export default function ReviewQuestionCard({ question }: { question: Question }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const selectedChoice = question.answer_choices.find((c) => c.id === selected)
  const isCorrect = selectedChoice?.is_correct ?? false
  const categoryName = question.categories?.[0]?.name

  async function handleSubmit() {
    if (!selected) return
    setSubmitted(true)
    await submitReviewAnswer(question.id, selected, isCorrect)
  }

  return (
    <div className="py-8">
      {categoryName && (
        <p className="text-xs uppercase tracking-wide text-gray-500">{categoryName}</p>
      )}
      <p className="mt-1 text-lg text-white">{question.question_text}</p>

      <div className="mt-4 space-y-2">
        {question.answer_choices.map((choice) => {
          const isSelected = selected === choice.id
          let style = 'border-gray-800 hover:border-gray-600 text-gray-300'

          if (submitted && choice.is_correct) style = 'border-green-600 text-green-500'
          else if (submitted && isSelected && !choice.is_correct) style = 'border-red-600 text-red-500'
          else if (isSelected) style = 'border-red-600 text-white'

          return (
            <button
              key={choice.id}
              disabled={submitted}
              onClick={() => setSelected(choice.id)}
              className={`w-full rounded border p-3 text-left text-sm sm:text-base ${style}`}
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
          className="mt-4 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-30"
        >
          Submit
        </button>
      ) : (
        <div className="mt-4">
          <p className={isCorrect ? 'text-sm font-medium text-green-500' : 'text-sm font-medium text-red-500'}>
            {isCorrect ? 'Correct' : 'Still incorrect'}
          </p>
          {question.explanation && (
            <p className="mt-2 text-sm text-gray-400">{question.explanation}</p>
          )}
        </div>
      )}
    </div>
  )
}