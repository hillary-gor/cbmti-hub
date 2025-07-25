'use client'

import { useToast } from '@/components/ui/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed inset-0 z-50 flex items-end px-4 py-6 pointer-events-none sm:items-start sm:p-6">
      <ul className="flex flex-col w-full max-w-sm mx-auto space-y-4 sm:items-end">
        {toasts.map(({ id, title, description, action, ...props }) => (
          <li key={id} {...props}>
            <div className="bg-white shadow-lg rounded-lg p-4">
              {title && <p className="text-sm font-medium leading-none">{title.toString()}</p>}
              {description && <p className="mt-1 text-sm text-muted-foreground">{description.toString()}</p>}
              {action}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
