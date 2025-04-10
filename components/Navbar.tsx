'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b backdrop-blur-md bg-background/80 sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold tracking-tight">
        Code Blue
      </Link>
      <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
        <Link href="#features" className="hover:text-foreground transition">Features</Link>
        <Link href="#testimonials" className="hover:text-foreground transition">Testimonials</Link>
        <Link href="#contact" className="hover:text-foreground transition">Contact</Link>
      </nav>
      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="outline" size="sm">Login</Button>
        </Link>
      </div>
    </header>
  )
}
