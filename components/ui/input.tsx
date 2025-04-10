'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, errorMessage, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-xl border bg-white px-4 py-2 text-sm text-black',
            'placeholder-gray-500 transition-colors duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-[#329EE8] focus:border-[#329EE8]',
            'dark:bg-zinc-900 dark:text-white dark:placeholder-gray-400',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-gray-700',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
