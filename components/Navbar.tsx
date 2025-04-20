'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full px-6 py-2 flex items-center justify-between border-b backdrop-blur-md bg-background/80 sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#329EE8]">
        <Image
          src="https://gowiaewbjsdsvihqmsyg.supabase.co/storage/v1/object/public/assets//logo.svg"
          alt="cbmti Hub logo"
          width={48}
          height={48}
          priority
        />
        <span>CBMTI Hub</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6 text-sm text-muted-foreground">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="hover:text-[#329EE8] transition"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden md:flex gap-4">
        <Link href="/login">
          <Button
            variant="outline"
            size="sm"
            className="border-[#329EE8] text-[#329EE8] hover:bg-[#329EE8]/10"
          >
            Login
          </Button>
        </Link>
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 w-full bg-background border-b md:hidden flex flex-col items-start px-6 py-4 gap-4 z-40 overflow-hidden"
          >
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-foreground"
              >
                {label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
              <Button
                variant="outline"
                className="w-full border-[#329EE8] text-[#329EE8] hover:bg-[#329EE8]/10"
              >
                Login
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
