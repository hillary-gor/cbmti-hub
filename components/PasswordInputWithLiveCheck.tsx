'use client'

import { useEffect, useState } from 'react'

type Props = {
  name?: string
  error?: string
  onValidPassword?: (valid: boolean, value: string) => void
}

export default function PasswordInputWithLiveCheck({ name = 'password', error, onValidPassword }: Props) {
  const [value, setValue] = useState('')
  const [criteria, setCriteria] = useState({
    upper: false,
    lower: false,
    number: false,
    symbol: false,
    length: false,
  })

  useEffect(() => {
    const updated = {
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
      length: value.length >= 8 && value.length <= 60,
    }

    setCriteria(updated)

    const isValid = Object.values(updated).every(Boolean)
    if (onValidPassword) onValidPassword(isValid, value)
  }, [value, onValidPassword])

  const getColor = (valid: boolean) => (valid ? 'text-green-600' : 'text-red-500')

  return (
    <div>
      <input
        type="password"
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Create password"
        className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="mt-2 space-y-1 text-sm">
        <p className={getColor(criteria.upper)}>• At least one uppercase letter</p>
        <p className={getColor(criteria.lower)}>• At least one lowercase letter</p>
        <p className={getColor(criteria.number)}>• At least one number</p>
        <p className={getColor(criteria.symbol)}>• At least one symbol (!@#$...)</p>
        <p className={getColor(criteria.length)}>• 8–60 characters</p>
      </div>
    </div>
  )
}
