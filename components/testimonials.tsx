"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Hawky.ai has transformed how we approach creative optimization. We've seen a 40% increase in conversion rates since implementing their platform.",
    author: "Sarah Johnson",
    title: "Marketing Director",
    company: "La Marquise",
  },
  {
    quote:
      "The insights we get from Hawky.ai have been game-changing for our creative team. We now know exactly what elements drive performance.",
    author: "Michael Chen",
    title: "Head of Digital Marketing",
    company: "Guvi",
  },
  {
    quote:
      "Implementing Hawky.ai was one of the best decisions we made last year. Our ROAS has improved by 35% across all platforms.",
    author: "Priya Sharma",
    title: "Performance Marketing Lead",
    company: "Bajaj Finserv",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative bg-gray-1 rounded-xl border border-gray-3/20 p-6">
      <Quote className="absolute top-6 left-6 h-8 w-8 text-gray-3/50" />

      <div className="pt-8 pb-4">
        <p className="text-gray-11 italic relative z-10">"{testimonials[currentIndex].quote}"</p>

        <div className="mt-6 flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white font-semibold">
            {testimonials[currentIndex].author.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-medium text-white">{testimonials[currentIndex].author}</p>
            <p className="text-sm text-gray-9">
              {testimonials[currentIndex].title}, {testimonials[currentIndex].company}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={prevTestimonial}
          className="p-2 rounded-full hover:bg-gray-2 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-1 items-center">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`block h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
                  : "w-1.5 bg-gray-3"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextTestimonial}
          className="p-2 rounded-full hover:bg-gray-2 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
