'use client'

interface ConfidenceSelectorProps {
  value: number | null
  onChange: (value: 1 | 2 | 3) => void
  disabled?: boolean
}

export default function ConfidenceSelector({ value, onChange, disabled }: ConfidenceSelectorProps) {
  const options: { value: 1 | 2 | 3; label: string; color: string }[] = [
    { value: 1, label: '1 pt', color: 'bg-green-100 border-green-400 text-green-700' },
    { value: 2, label: '2 pts', color: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
    { value: 3, label: '3 pts', color: 'bg-red-100 border-red-400 text-red-700' },
  ]

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`
            px-3 py-1 rounded-full text-sm font-semibold border-2 transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
            ${value === option.value
              ? option.color + ' ring-2 ring-offset-1 ring-gray-400'
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
