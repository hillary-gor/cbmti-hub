'use client'

import { useFormStatus } from 'react-dom'
import { Button } from './button'
import Image from 'next/image'

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode
  logoUrl?: string
}

export function LoadingButton({ children, logoUrl, ...props }: LoadingButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button {...props} disabled={pending || props.disabled}>
      {pending && logoUrl && (
        <Image
          src={logoUrl}
          alt="Loading"
          width={20}
          height={20}
          className="mr-2 animate-spin"
        />
      )}
      {children}
    </Button>
  )
}
