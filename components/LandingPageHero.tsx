'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import 'keen-slider/keen-slider.min.css'

const sliderImages = [
  '/baker-and-eddie.png',
  '/sandra.JPG',
  '/shanice_serious.JPG',
  '/another_happy_hero.JPG',
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    drag: true,
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),
  })

  useEffect(() => {
    if (!slider) return

    const interval = setInterval(() => {
      const nextIndex = (slider.current?.track.details.rel ?? 0) + 1
      const slideCount = slider.current?.track.details.slides.length ?? 1
      slider.current?.moveToIdx(nextIndex % slideCount, true, { duration: 800 })
    }, 4000)

    return () => clearInterval(interval)
  }, [slider])

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20 h-full">
        {/* === Left: Text Content === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-6 text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-foreground text-balance dark:text-white">
            Empowering Healthcare Students Across Kenya
          </h1>

          <p className="text-muted-foreground text-lg max-w-prose mx-auto lg:mx-0 dark:text-white">
            Register, learn, and thrive through our seamless digital student portal — your gateway to success in the healthcare field.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
            <Link href="/login">
              <Button size="lg" className="bg-[#329EE8] text-white hover:bg-[#2b8ed3]">
                Access Your Account
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg">
                Join eHub
              </Button>
            </Link>
          </div>

          <section aria-labelledby="features-heading">
            <h2 id="features-heading" className="sr-only">Platform Features</h2>
            <ul
              role="list"
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 pt-6 text-sm text-foreground font-medium dark:text-white"
            >
              <li>📅 Digital Timetables</li>
              <li>📘 E-learning Modules</li>
              <li>📝 Online Exams</li>
              <li>📄 Auto Certificates</li>
              <li>🏥 Clinical Placement</li>
              <li>🔐 Secure Login</li>
            </ul>
          </section>
        </motion.div>

        {/* === Right: Image Slider === */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="relative w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="w-full">
            <div
              ref={sliderRef}
              className="keen-slider rounded-xl overflow-hidden drop-shadow-xl"
            >
              {sliderImages.map((src, i) => (
                <div className="keen-slider__slide" key={i}>
                  <Image
                    src={src}
                    alt={`Slide ${i + 1}`}
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    slider.current?.moveToIdx(idx, true, { duration: 800 })
                  }
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 w-4 rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? 'bg-blue-500 w-6'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
