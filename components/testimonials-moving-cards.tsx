"use client"

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

const testimonials = [
  {
    quote:
      "Hawky.ai has transformed how we approach creative optimization. We've seen a 40% increase in conversion rates since implementing their platform.",
    name: "Sarah Johnson",
    title: "Marketing Director, La Marquise",
  },
  {
    quote:
      "The insights we get from Hawky.ai have been game-changing for our creative team. We now know exactly what elements drive performance.",
    name: "Michael Chen",
    title: "Head of Digital Marketing, Guvi",
  },
  {
    quote:
      "Implementing Hawky.ai was one of the best decisions we made last year. Our ROAS has improved by 35% across all platforms.",
    name: "Priya Sharma",
    title: "Performance Marketing Lead, Bajaj Finserv",
  },
  {
    quote:
      "The platform's ability to identify winning creative elements has been a game-changer for our campaigns. Our ad spend efficiency improved dramatically.",
    name: "Alex Rodriguez",
    title: "Digital Marketing Manager, Smallcase",
  },
  {
    quote:
      "Hawky.ai's performance guardian feature has saved us countless hours of manual monitoring and helped us optimize campaigns in real-time.",
    name: "Rahul Mehta",
    title: "Growth Lead, Rummyverse",
  },
]

export function TestimonialsMovingCards() {
  return (
    <div className="relative overflow-hidden py-10">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>
  )
}
