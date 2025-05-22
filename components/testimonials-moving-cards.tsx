"use client"

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

const testimonials = [
  {
    quote:
      "We haven't seen analysis this detailed before. This is a powerful vision with serious potential.",
    name: "Performance Marketing Head",
    title: "Fast-Growing EdTech Platform",
  },
  {
    quote:
      "I became a fan of the product the moment I saw it. This is the future of digital marketing.",
    name: "CMO",
    title: "Leading FinTech Brand in India",
  },
]

export function TestimonialsMovingCards() {
  return (
    <div className="relative overflow-hidden py-10">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>
  )
}
